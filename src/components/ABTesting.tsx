import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Space,
  Alert,
  Table,
  Progress,
  Badge,
  Descriptions,
  Row,
  Col,
  Modal,
  Statistic,
} from "antd";
import {
  ChartBarIcon,
  BeakerIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { fraudAPI } from "../services/api";
import { ABTest, ABTestResults } from "../types";
import toast from "react-hot-toast";

const ABTesting: React.FC = () => {
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [activeTests, setActiveTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [testResults, setTestResults] = useState<ABTestResults | null>(null);
  const [resultModalVisible, setResultModalVisible] = useState(false);

  const handleCreateTest = async (values: any) => {
    setLoading(true);

    try {
      const response = await fraudAPI.createABTest(values);
      const newTest: ABTest = {
        testId: response.data.testId || `test_${Date.now()}`,
        ...values,
        status: "active",
        createdAt: new Date().toISOString(),
      };

      setActiveTests((prev) => [...prev, newTest]);
      createForm.resetFields();
      toast.success("A/B test created successfully");
    } catch (error: any) {
      console.error("A/B test creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create A/B test");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (test: ABTest) => {
    setResultLoading(true);
    setSelectedTest(test);

    try {
      const response = await fraudAPI.getABTestResults(test.testId);
      setTestResults(response.data.results || response.data);
      setResultModalVisible(true);
    } catch (error: any) {
      console.error("Failed to fetch test results:", error);
      // Show mock results if API fails
      const mockResults: ABTestResults = {
        totalTransactions: 10000,
        controlGroup: {
          transactions: 5000,
          accuracy: 0.92,
          precision: 0.89,
          recall: 0.87,
          f1Score: 0.88,
        },
        treatmentGroup: {
          transactions: 4750,
          accuracy: 0.94,
          precision: 0.91,
          recall: 0.89,
          f1Score: 0.9,
        },
        statisticalSignificance: true,
        winner: "treatment",
      };
      setTestResults(mockResults);
      setResultModalVisible(true);
      toast("Showing mock results - API may not be implemented yet", {
        icon: "ℹ️",
      });
    } finally {
      setResultLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "success", text: "Active" },
      paused: { color: "warning", text: "Paused" },
      completed: { color: "default", text: "Completed" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge status={config.color as any} text={config.text} />;
  };

  const columns = [
    {
      title: "Test Name",
      dataIndex: "testName",
      key: "testName",
    },
    {
      title: "Control Model",
      dataIndex: "controlModelVersion",
      key: "controlModelVersion",
    },
    {
      title: "Treatment Model",
      dataIndex: "treatmentModelVersion",
      key: "treatmentModelVersion",
    },
    {
      title: "Holdout %",
      dataIndex: "holdoutPercentage",
      key: "holdoutPercentage",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: ABTest) => (
        <Space>
          <Button
            size="small"
            onClick={() => handleViewResults(record)}
            loading={resultLoading && selectedTest?.testId === record.testId}
          >
            View Results
          </Button>
        </Space>
      ),
    },
  ];

  const renderResultsModal = () => {
    if (!testResults || !selectedTest) return null;

    const { controlGroup, treatmentGroup } = testResults;
    const winner = testResults.winner;

    return (
      <Modal
        title={`A/B Test Results: ${selectedTest.testName}`}
        open={resultModalVisible}
        onCancel={() => setResultModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setResultModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-6">
          {/* Summary */}
          <Card size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Total Transactions"
                  value={testResults.totalTransactions}
                  prefix={<ChartBarIcon className="w-4 h-4" />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Statistical Significance"
                  value={testResults.statisticalSignificance ? "Yes" : "No"}
                  valueStyle={{
                    color: testResults.statisticalSignificance
                      ? "#3f8600"
                      : "#cf1322",
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Winner"
                  value={
                    winner
                      ? winner.charAt(0).toUpperCase() + winner.slice(1)
                      : "Inconclusive"
                  }
                  valueStyle={{
                    color:
                      winner === "treatment"
                        ? "#3f8600"
                        : winner === "control"
                          ? "#1890ff"
                          : "#cf1322",
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* Performance Comparison */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Control Group (v1.0)" size="small">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Accuracy</span>
                      <span>{(controlGroup.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={controlGroup.accuracy * 100}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Precision</span>
                      <span>{(controlGroup.precision * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={controlGroup.precision * 100}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Recall</span>
                      <span>{(controlGroup.recall * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={controlGroup.recall * 100}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>F1 Score</span>
                      <span>{(controlGroup.f1Score * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={controlGroup.f1Score * 100}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Transactions">
                      {controlGroup.transactions.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Treatment Group (v2.0)" size="small">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Accuracy</span>
                      <span>{(treatmentGroup.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={treatmentGroup.accuracy * 100}
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Precision</span>
                      <span>
                        {(treatmentGroup.precision * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      percent={treatmentGroup.precision * 100}
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Recall</span>
                      <span>{(treatmentGroup.recall * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={treatmentGroup.recall * 100}
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>F1 Score</span>
                      <span>{(treatmentGroup.f1Score * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      percent={treatmentGroup.f1Score * 100}
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Transactions">
                      {treatmentGroup.transactions.toLocaleString()}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recommendation */}
          {testResults.statisticalSignificance && (
            <Alert
              message={
                winner === "treatment"
                  ? "Recommendation: Deploy Treatment Model"
                  : winner === "control"
                    ? "Recommendation: Keep Control Model"
                    : "Recommendation: Continue Testing"
              }
              description={
                winner === "treatment"
                  ? "The treatment model shows statistically significant improvement across key metrics."
                  : winner === "control"
                    ? "The control model performs better. The treatment model needs improvement."
                    : "Results are inconclusive. Consider running the test longer or adjusting parameters."
              }
              type={
                winner === "treatment"
                  ? "success"
                  : winner === "control"
                    ? "info"
                    : "warning"
              }
              showIcon
            />
          )}
        </div>
      </Modal>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 A/B Testing
        </h1>
        <p className="text-gray-600">
          Compare fraud detection models and analyze performance metrics
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Create New Test */}
        <Col xs={24} lg={8}>
          <Card title="Create New A/B Test">
            <Form
              form={createForm}
              layout="vertical"
              onFinish={handleCreateTest}
              initialValues={{
                holdoutPercentage: 5,
              }}
            >
              <Form.Item
                label="Test Name"
                name="testName"
                rules={[{ required: true, message: "Please enter test name" }]}
              >
                <Input placeholder="Enter test name" />
              </Form.Item>

              <Form.Item
                label="Control Model Version"
                name="controlModelVersion"
                rules={[
                  {
                    required: true,
                    message: "Please enter control model version",
                  },
                ]}
              >
                <Input placeholder="e.g., v1.0" />
              </Form.Item>

              <Form.Item
                label="Treatment Model Version"
                name="treatmentModelVersion"
                rules={[
                  {
                    required: true,
                    message: "Please enter treatment model version",
                  },
                ]}
              >
                <Input placeholder="e.g., v2.0" />
              </Form.Item>

              <Form.Item
                label="Holdout Percentage"
                name="holdoutPercentage"
                rules={[
                  {
                    required: true,
                    message: "Please enter holdout percentage",
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  max={50}
                  suffix="%"
                  placeholder="Enter holdout percentage"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<PlayIcon className="w-4 h-4" />}
                className="w-full"
              >
                Create A/B Test
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Test Information */}
        <Col xs={24} lg={16}>
          <Card title="A/B Testing Information">
            <Alert
              message="A/B Testing for Fraud Detection"
              description={
                <div className="space-y-2">
                  <p>
                    A/B testing allows you to compare the performance of
                    different fraud detection models in a controlled
                    environment. Key metrics include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>Accuracy:</strong> Overall correctness of fraud
                      predictions
                    </li>
                    <li>
                      <strong>Precision:</strong> Of predicted frauds, how many
                      were actually fraud
                    </li>
                    <li>
                      <strong>Recall:</strong> Of actual frauds, how many were
                      correctly identified
                    </li>
                    <li>
                      <strong>F1 Score:</strong> Harmonic mean of precision and
                      recall
                    </li>
                  </ul>
                  <p className="text-sm mt-2">
                    <strong>Holdout Percentage:</strong> Percentage of traffic
                    that goes to the treatment model. The rest goes to the
                    control model.
                  </p>
                </div>
              }
              type="info"
              showIcon
            />
          </Card>
        </Col>
      </Row>

      {/* Active Tests Table */}
      <Card title="Active A/B Tests">
        <Table
          columns={columns}
          dataSource={activeTests}
          rowKey="testId"
          pagination={false}
          locale={{
            emptyText: "No active A/B tests. Create one above to get started.",
          }}
        />
      </Card>

      {/* Results Modal */}
      {renderResultsModal()}
    </div>
  );
};

export default ABTesting;
