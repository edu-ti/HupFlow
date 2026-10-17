import { SystemHealthReport, EnterpriseChecklistItem } from './types';
import { evaluateSystemHealth, getEnterpriseReadinessChecklist } from './system.test';

export { evaluateSystemHealth, getEnterpriseReadinessChecklist };

export async function getSystemDiagnostics(): Promise<{
  report: SystemHealthReport;
  checklist: EnterpriseChecklistItem[];
}> {
  const report = evaluateSystemHealth();
  const checklist = getEnterpriseReadinessChecklist();
  return { report, checklist };
}
