import React, { useState } from "react";
import {
  Card,
  Upload,
  Button,
  Form,
  Input,
  Space,
  Alert,
  Progress,
  List,
  Badge,
  Descriptions,
  Row,
  Col,
} from "antd";
import { PlayIcon } from "@heroicons/react/24/outline";
import { InboxOutlined } from "@ant-design/icons";
import { fraudAPI } from "../services/api";
import toast from "react-hot-toast";
const { Dragger } = Upload;

const DataManagement: React.FC = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [etlLoading, setETLLoading] = useState(false);
  const [etlResult, setETLResult] = useState<any>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [pollingLoading, setPollingLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFileUpload = async (file: File) => {
    setUploadLoading(true);
    setUploadResult(null);

    try {
      const response = await fraudAPI.uploadFile(file);
      setUploadResult(response.data);
      toast.success("File uploaded and processed successfully");
    } catch (error: any) {
      console.error("File upload error:", error);
      const errorMsg = error.response?.data?.message || "File upload failed";
      toast.error(errorMsg);
      setUploadResult({
        success: false,
        error: errorMsg,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleETLRun = async () => {
    setETLLoading(true);
    setETLResult(null);

    try {
      const response = await fraudAPI.runETLPipeline({
        source: "database",
        target: "ml_features",
        includeHistorical: true,
      });
      setETLResult(response.data);
      toast.success("ETL pipeline started successfully");
    } catch (error: any) {
      console.error("ETL pipeline error:", error);
      const errorMsg =
        error.response?.data?.message || "ETL pipeline failed to start";
      toast.error(errorMsg);
      setETLResult({
        success: false,
        error: errorMsg,
      });
    } finally {
      setETLLoading(false);
    }
  };

  const handleWebhookTest = async (values: any) => {
    setWebhookLoading(true);

    const sampleWebhookData = {
      event_type: "payment_processed",
      timestamp: new Date().toISOString(),
      data: {
        transaction_id: `webhook_txn_${Date.now()}`,
        amount: 299.99,
        currency: "USD",
        payment_method: "credit_card",
        country_code: "US",
        user_id: "webhook_user_123",
        merchant_id: "merchant_001",
      },
    };

    try {
      const response = await fraudAPI.processWebhook(
        values.providerId,
        sampleWebhookData,
      );
      toast.success(`Webhook processed for provider: ${values.providerId}`);
      console.log("Webhook response:", response.data);
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      toast.error(error.response?.data?.message || "Webhook processing failed");
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleDataPolling = async (providerId: string) => {
    setPollingLoading(true);

    try {
      const response = await fraudAPI.triggerDataPolling(providerId);
      toast.success(`Data polling triggered for provider: ${providerId}`);
      console.log("Polling response:", response.data);
    } catch (error: any) {
      console.error("Data polling error:", error);
      toast.error(error.response?.data?.message || "Data polling failed");
    } finally {
      setPollingLoading(false);
    }
  };

  const uploadProps = {
    name: "dataFile",
    multiple: false,
    accept: ".csv",
    beforeUpload: (file: File) => {
      handleFileUpload(file);
      return false; // Prevent default upload
    },
    onDrop: (e: any) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Data Management
        </h1>
        <p className="text-gray-600">
          Upload files, manage ETL pipelines, and configure data sources
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* File Upload */}
        <Col xs={24} lg={12}>
          <Card title="File Upload">
            <Dragger {...uploadProps} disabled={uploadLoading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for CSV, JSON, XML, and TXT files. Maximum file size:
                10MB
              </p>
            </Dragger>

            {uploadLoading && (
              <div className="mt-4">
                <Progress type="line" percent={50} status="active" />
                <p className="text-sm text-gray-500 mt-2">Processing file...</p>
              </div>
            )}

            {uploadResult && (
              <div className="mt-4">
                {uploadResult.success ? (
                  <Alert
                    message="File Processed Successfully"
                    type="success"
                    showIcon
                  />
                ) : (
                  <Alert
                    message="File Processing Failed"
                    description={uploadResult.error}
                    type="error"
                    showIcon
                  />
                )}
              </div>
            )}
          </Card>
        </Col>

        {/* ETL Pipeline */}
        <Col xs={24} lg={12}>
          <Card title="ETL Pipeline">
            <div className="space-y-4">
              <Alert
                message="ETL Pipeline Control"
                description="Run the Extract, Transform, Load pipeline to process payment data and prepare features for ML models."
                type="info"
                showIcon
              />

              <Button
                type="primary"
                size="large"
                loading={etlLoading}
                onClick={handleETLRun}
                icon={<PlayIcon className="w-4 h-4" />}
                className="w-full mt-4"
              >
                Run ETL Pipeline
              </Button>

              {etlResult && (
                <div className="mt-4">
                  {etlResult.success ? (
                    <Alert
                      message="ETL Pipeline Started"
                      description={
                        <Descriptions size="small" column={1}>
                          <Descriptions.Item label="Job ID">
                            {etlResult.jobId || "N/A"}
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            <Badge
                              status="processing"
                              text={etlResult.status || "Running"}
                            />
                          </Descriptions.Item>
                          <Descriptions.Item label="Started At">
                            {etlResult.startedAt || new Date().toLocaleString()}
                          </Descriptions.Item>
                        </Descriptions>
                      }
                      type="success"
                      showIcon
                    />
                  ) : (
                    <Alert
                      message="ETL Pipeline Failed"
                      description={etlResult.error}
                      type="error"
                      showIcon
                    />
                  )}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Webhook Integration */}
        <Col xs={24} lg={12}>
          <Card title="Webhook Integration">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleWebhookTest}
              initialValues={{
                providerId: "test_provider",
              }}
            >
              <Form.Item
                label="Provider ID"
                name="providerId"
                rules={[
                  { required: true, message: "Please enter provider ID" },
                ]}
              >
                <Input placeholder="Enter provider ID" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={webhookLoading}
                className="w-full"
              >
                Test Webhook Processing
              </Button>
            </Form>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                This will send a sample webhook payload to test the integration.
              </p>
            </div>
          </Card>
        </Col>

        {/* Data Polling */}
        <Col xs={24} lg={12}>
          <Card title="Data Polling">
            <div className="space-y-4">
              <Alert
                message="Data Source Polling"
                description="Trigger manual data polling from external providers."
                type="info"
                showIcon
              />

              <Space direction="vertical" className="w-full mt-4">
                <Button
                  type="default"
                  loading={pollingLoading}
                  onClick={() => handleDataPolling("provider_1")}
                  className="w-full"
                >
                  Poll Provider 1
                </Button>
                <Button
                  type="default"
                  loading={pollingLoading}
                  onClick={() => handleDataPolling("provider_2")}
                  className="w-full"
                >
                  Poll Provider 2
                </Button>
                <Button
                  type="default"
                  loading={pollingLoading}
                  onClick={() => handleDataPolling("test_provider")}
                  className="w-full"
                >
                  Poll Test Provider
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sample Data Formats */}
      <Card title="Supported Data Formats">
        <List
          itemLayout="horizontal"
          dataSource={[
            {
              title: "CSV Format",
              description:
                "transaction_id,amount,currency,payment_method,country_code,user_id",
              icon: "📊",
            },
            {
              title: "JSON Format",
              description:
                '{"transaction_id": "txn_123", "amount": 150.00, "currency": "USD", ...}',
              icon: "📋",
            },
            {
              title: "Webhook Format",
              description:
                '{"event_type": "payment_processed", "timestamp": "2024-01-01T00:00:00Z", ...}',
              icon: "🔗",
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<span className="text-2xl">{item.icon}</span>}
                title={item.title}
                description={
                  <code className="text-xs bg-gray-100 p-1 rounded">
                    {item.description}
                  </code>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default DataManagement;
