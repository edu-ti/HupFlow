export interface ServiceHealthStatus {
  name: string;
  status: 'up' | 'degraded' | 'down';
  latencyMs: number;
  details?: Record<string, any>;
}

export interface SystemHealthReport {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  version: string;
  milestone: string;
  uptimeSeconds: number;
  featuresCount: number;
  environment: string;
  timestamp: string;
  services: {
    database: ServiceHealthStatus;
    cache: ServiceHealthStatus;
    storage: ServiceHealthStatus;
    scheduler: ServiceHealthStatus;
  };
  memoryUsage: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  cleanRoomChecklist: {
    totalFeaturesCompleted: number;
    agplViolationsCount: number;
    closedProprietarySdkCount: number;
    multiTenantEnforced: boolean;
    typeScriptErrorsCount: number;
  };
}

export interface EnterpriseChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  badge: string;
}
