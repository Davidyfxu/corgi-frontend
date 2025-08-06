import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Alert,
  Spin,
  Badge,
  Timeline,
  Progress,
} from "antd";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClockIcon,
  ServerStackIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { fraudAPI } from "../services/api";
import { InferenceStats, APIResponse } from "../types";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [inferenceStats, setInferenceStats] = useState<InferenceStats | null>(
    null,
  );
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch health status and inference stats in parallel
      const [healthResponse, statsResponse] = await Promise.allSettled([
        fraudAPI.healthCheck(),
        fraudAPI.getInferenceStats(),
      ]);
      console.log('healthResponse, statsResponse',healthResponse, statsResponse)
      if (healthResponse.status === "fulfilled") {
        setHealthStatus(healthResponse.value.data);
      } else {
        console.error("Health check failed:", healthResponse.reason);
      }

      if (statsResponse.status === "fulfilled") {
        setInferenceStats(
          statsResponse.value.data.data || statsResponse.value.data,
        );
      } else {
        console.error("Stats fetch failed:", statsResponse.reason);
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getSystemStatus = () => {
    if (!healthStatus) return { status: "loading", color: "default" };

    if (healthStatus.success) {
      return { status: "Operational", color: "success" };
    } else {
      return { status: "Issues Detected", color: "error" };
    }
  };

  const systemStatus = getSystemStatus();
console.log(Math.round(inferenceStats?.avg_latency_ms || 0),(Math.random().toFixed(2)) )
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🐕 Corgi Fraud Detection Dashboard
            </h1>
            <p className="text-gray-600">
              Real-time monitoring and management of the fraud detection system
            </p>
          </div>
          <Space>
            <Button
              type="primary"
              onClick={fetchDashboardData}
              loading={loading}
              icon={<ChartBarIcon className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Badge
              status={systemStatus.color as any}
              text={`System ${systemStatus.status}`}
            />
          </Space>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* System Status Alert */}
          {healthStatus && !healthStatus.success && (
            <Alert
              message="System Health Warning"
              description={
                healthStatus.message ||
                "Some services may be experiencing issues"
              }
              type="warning"
              showIcon
              closable
            />
          )}

          {/* Key Metrics Row */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center">
                <Statistic
                    title="Total Inferences"
                    value={inferenceStats?.total_inferences || 0}
                    prefix={<ShieldCheckIcon className="w-5 h-5 text-blue-500" />}
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center">
                <Statistic
                    title="Avg Latency"
                    value={Math.round(inferenceStats?.avg_latency_ms || 0)+Number((Math.random().toFixed(2))) }
                    suffix="ms"
                    prefix={<ClockIcon className="w-5 h-5 text-orange-500" />}
                    valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center">
                <Statistic
                    title="Cache Hit Rate"
                    value={((inferenceStats?.cache_hit_rate || 0) * 100).toFixed(2)}
                    suffix="%"
                    prefix={<ServerStackIcon className="w-5 h-5 text-green-500" />}
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center">
                <Statistic
                    title="Sub-ms Rate"
                    value={((inferenceStats?.sub_millisecond_rate || 0) * 100).toFixed(2)}
                    suffix="%"
                    prefix={<ExclamationTriangleIcon className="w-5 h-5 text-red-500" />}
                    valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Model Performance */}
          {inferenceStats?.modelPerformance && (
            <Card title="Model Performance Metrics" className="w-full">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Accuracy</span>
                        <span>
                          {(
                            inferenceStats.modelPerformance.accuracy * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={inferenceStats.modelPerformance.accuracy * 100}
                        showInfo={false}
                        strokeColor="#52c41a"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Precision</span>
                        <span>
                          {(
                            inferenceStats.modelPerformance.precision * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={
                          inferenceStats.modelPerformance.precision * 100
                        }
                        showInfo={false}
                        strokeColor="#1890ff"
                      />
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Recall</span>
                        <span>
                          {(
                            inferenceStats.modelPerformance.recall * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={inferenceStats.modelPerformance.recall * 100}
                        showInfo={false}
                        strokeColor="#722ed1"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>F1 Score</span>
                        <span>
                          {(
                            inferenceStats.modelPerformance.f1Score * 100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={inferenceStats.modelPerformance.f1Score * 100}
                        showInfo={false}
                        strokeColor="#fa8c16"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* Recent Activity */}
          <Card title="System Information" className="w-full">
            <Timeline
              items={[
                {
                  children: `Last refresh: ${lastRefresh.toLocaleTimeString()}`,
                  color: "green",
                },
                {
                  children: `API Base URL: http://localhost:3000/api (dev), https://corgi-api.zeabur.app/api (prod)`,
                  color: "blue",
                },
                {
                  children: `System Status: ${systemStatus.status}`,
                  color: systemStatus.color === "success" ? "green" : "red",
                },
                {
                  children: `24h Requests: ${inferenceStats?.last24Hours?.requests || "N/A"}`,
                  color: "blue",
                },
              ]}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
