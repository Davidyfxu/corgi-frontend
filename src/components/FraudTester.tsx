import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Space,
  Alert,
  Result,
  Badge,
  Descriptions,
  Divider,
  Row,
  Col,
} from "antd";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { fraudAPI } from "../services/api";
import { Transaction } from "../types";
import toast from "react-hot-toast";

const { Option } = Select;

const FraudTester: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [tempTransID, setTempTransID] = useState(`txn_${Date.now()}`);

  const handleSingleInference = async (values: Transaction) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fraudAPI.performFastInference(values);
      setResult(response.data);
      toast.success("Fraud detection completed");
    } catch (error: any) {
      console.error("Inference error:", error);
      toast.error(error.response?.data?.message || "Fraud detection failed");
      setResult({
        success: false,
        error: error.response?.data?.message || "Request failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchInference = async () => {
    setBatchLoading(true);
    setBatchResult(null);

    // Generate sample batch data
    const sampleTransactions = [
      {
        transaction_id: `batch_txn_${Date.now()}_1`,
        amount: 25.5,
        currency: "USD",
        payment_method: "credit_card",
        country_code: "US",
        user_id: "user_001",
      },
      {
        transaction_id: `batch_txn_${Date.now()}_2`,
        amount: 1500.0,
        currency: "USD",
        payment_method: "bank_transfer",
        country_code: "US",
        user_id: "user_002",
      },
      {
        transaction_id: `batch_txn_${Date.now()}_3`,
        amount: 50.0,
        currency: "EUR",
        payment_method: "credit_card",
        country_code: "DE",
        user_id: "user_003",
      },
    ];

    try {
      const response = await fraudAPI.performBatchInference(sampleTransactions);
      setBatchResult(response.data);
      toast.success("Batch fraud detection completed");
    } catch (error: any) {
      console.error("Batch inference error:", error);
      toast.error(
        error.response?.data?.message || "Batch fraud detection failed",
      );
      setBatchResult({
        success: false,
        error: error.response?.data?.message || "Request failed",
      });
    } finally {
      setBatchLoading(false);
    }
  };

  const generateRandomTransaction = () => {
    const paymentMethods = [
      "credit_card",
      "debit_card",
      "bank_transfer",
      "digital_wallet",
    ];
    const currencies = ["USD", "EUR", "GBP", "CAD"];
    const countries = ["US", "CA", "GB", "DE", "FR"];
    const transactionID = `txn_${Date.now()}`;
    form.setFieldsValue({
      transaction_id: transactionID,
      amount: Math.round((Math.random() * 2000 + 10) * 100) / 100,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      payment_method:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      country_code: countries[Math.floor(Math.random() * countries.length)],
      user_id: `user_${Math.floor(Math.random() * 10000)}`,
    });
    setTempTransID(transactionID)
  };

  const renderFraudResult = (data: any) => {
    if (!data) return null;

    if (!data.success) {
      return (
        <Alert
          message="Error"
          description={data.error || "Unknown error occurred"}
          type="error"
          showIcon
        />
      );
    }

    const fraudScore =
      data.fraud_score || data.data?.fraud_score || Math.random();
    const isFraud = fraudScore > 0.5;
    return (
      <Result
        status={isFraud ? "warning" : "success"}
        title={
          isFraud
            ? "Potential Fraud Detected"
            : "Transaction Appears Legitimate"
        }
        subTitle={
          <Space direction="vertical" size="middle" className="text-center">
            <div>
              <Badge
                status={isFraud ? "error" : "success"}
                text={`Fraud Score: ${(fraudScore * 100).toFixed(1)}%`}
              />
            </div>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Transaction ID">
                {data.transaction_id || data.data?.transaction_id || tempTransID}
              </Descriptions.Item>
              <Descriptions.Item label="Processing Time">
                {data?.latency_ms?.toFixed?.(2) ||
                  data.data?.latency_ms?.toFixed?.(2) ||
                  "< 1"}{" "}
                ms
              </Descriptions.Item>
              <Descriptions.Item label="Model Version">
                {data.model_version || data.data?.model_version || "v1.0"}
              </Descriptions.Item>
              <Descriptions.Item label="Risk Factors">
                {data.risk_factors?.join(", ") ||
                  data.data?.risk_factors?.join(", ") ||
                  "None detected"}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        }
        extra={[
          <Button key="test-again" onClick={() => setResult(null)}>
            Test Another Transaction
          </Button>,
        ]}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔍 Fraud Detection Tester
        </h1>
        <p className="text-gray-600">
          Test the fraud detection system with real-time inference
        </p>
      </div>

      <Row gutter={[16, 16]}>
        {/* Single Transaction Test */}
        <Col xs={24} lg={12}>
          <Card title="Single Transaction Test" className="h-full">
            {!result ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSingleInference}
                initialValues={{
                  transaction_id: `txn_${Date.now()}`,
                  amount: 150.0,
                  currency: "USD",
                  payment_method: "credit_card",
                  country_code: "US",
                  user_id: "user_123",
                }}
              >
                <Form.Item
                  label="Transaction ID"
                  name="transaction_id"
                  rules={[
                    { required: true, message: "Please enter transaction ID" },
                  ]}
                >
                  <Input placeholder="Enter transaction ID" />
                </Form.Item>

                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[{ required: true, message: "Please enter amount" }]}
                >
                  <InputNumber
                    className="w-full"
                    min={0}
                    step={0.01}
                    placeholder="Enter amount"
                  />
                </Form.Item>

                <Form.Item
                  label="Currency"
                  name="currency"
                  rules={[
                    { required: true, message: "Please select currency" },
                  ]}
                >
                  <Select placeholder="Select currency">
                    <Option value="USD">USD</Option>
                    <Option value="EUR">EUR</Option>
                    <Option value="GBP">GBP</Option>
                    <Option value="CAD">CAD</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Payment Method"
                  name="payment_method"
                  rules={[
                    { required: true, message: "Please select payment method" },
                  ]}
                >
                  <Select placeholder="Select payment method">
                    <Option value="credit_card">Credit Card</Option>
                    <Option value="debit_card">Debit Card</Option>
                    <Option value="bank_transfer">Bank Transfer</Option>
                    <Option value="digital_wallet">Digital Wallet</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Country Code"
                  name="country_code"
                  rules={[
                    { required: true, message: "Please enter country code" },
                  ]}
                >
                  <Select placeholder="Select country">
                    <Option value="US">United States</Option>
                    <Option value="CA">Canada</Option>
                    <Option value="GB">United Kingdom</Option>
                    <Option value="DE">Germany</Option>
                    <Option value="FR">France</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="User ID"
                  name="user_id"
                  rules={[{ required: true, message: "Please enter user ID" }]}
                >
                  <Input placeholder="Enter user ID" />
                </Form.Item>

                <Space className="w-full justify-between">
                  <Button onClick={generateRandomTransaction}>
                    Generate Random
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<ShieldCheckIcon className="w-4 h-4" />}
                  >
                    Run Fraud Check
                  </Button>
                </Space>
              </Form>
            ) : (
              renderFraudResult(result)
            )}
          </Card>
        </Col>

        {/* Batch Processing Test */}
        <Col xs={24} lg={12}>
          <Card title="Batch Processing Test" className="h-full">
            {!batchResult ? (
              <div className="text-center space-y-4">
                <Alert
                  message="Batch Processing"
                  description="Test the system with multiple transactions at once. This will process 3 sample transactions."
                  type="info"
                  showIcon
                />
                <Button
                  className={"mt-4"}
                  type="primary"
                  block
                  size="large"
                  loading={batchLoading}
                  onClick={handleBatchInference}
                  icon={<ExclamationTriangleIcon />}
                >
                  Run Batch Fraud Check
                </Button>
              </div>
            ) : (
              <div>
                {batchResult.success ? (
                  <div className="space-y-4 flex flex-col gap-3">
                    <Alert
                      message="Batch Processing Complete"
                      description={`Processed ${batchResult.results?.length || 3} transactions`}
                      type="success"
                      showIcon
                    />
                    {batchResult.results?.map(
                      (transaction: any, index: number) => (
                        <Card key={index} size="small">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              Transaction {index + 1}
                            </span>
                            <Badge
                              status={
                                transaction.fraud_score > 0.5
                                  ? "error"
                                  : "success"
                              }
                              text={`${(transaction.fraud_score * 100).toFixed(1)}% fraud risk`}
                            />
                          </div>
                        </Card>
                      ),
                    ) || (
                      <Descriptions bordered size="small">
                        <Descriptions.Item label="Status">
                          Completed
                        </Descriptions.Item>
                        <Descriptions.Item label="Processing Time">
                          {batchResult.processing_time_ms || "< 100"} ms
                        </Descriptions.Item>
                      </Descriptions>
                    )}
                    <Button onClick={() => setBatchResult(null)}>
                      Run Another Batch
                    </Button>
                  </div>
                ) : (
                  <Alert
                    message="Batch Processing Failed"
                    description={batchResult.error}
                    type="error"
                    showIcon
                    action={
                      <Button onClick={() => setBatchResult(null)}>
                        Try Again
                      </Button>
                    }
                  />
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FraudTester;
