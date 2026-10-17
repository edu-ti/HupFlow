import { jsPDF } from 'jspdf';
import { ReportMetricsSnapshot } from './types';

export interface GeneratePdfOptions {
  brandName: string;
  reportTitle: string;
  periodLabel: string;
  metrics: ReportMetricsSnapshot;
  aiExecutiveSummary: string;
  agencyName?: string;
}

/**
 * Gera um documento PDF executivo vetorial para clientes de agência usando jsPDF nativo (MIT).
 */
export function buildExecutiveReportPdf(options: GeneratePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [99, 102, 241]; // Indigo #6366f1
  const darkBg = [15, 23, 42]; // Slate 900
  const cardBg = [248, 250, 252]; // Slate 50
  const textDark = [30, 41, 59]; // Slate 800
  const textMuted = [100, 116, 139]; // Slate 500

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(options.reportTitle, 15, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Cliente: ${options.brandName} | Período: ${options.periodLabel} | Agência: ${options.agencyName || 'HupFlow Agência'}`,
    15,
    26
  );

  // 2. Resumo Executivo / AI Highlights Box
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 46, 180, 28, 3, 3, 'FD');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INSIGHT EXECUTIVO & ANÁLISE DE CRESCIMENTO (IA)', 20, 53);

  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const splitText = doc.splitTextToSize(options.aiExecutiveSummary, 170);
  doc.text(splitText, 20, 60);

  // 3. Grid de KPIs Principais (4 Colunas)
  const kpis = [
    { label: 'Impressões Totais', value: options.metrics.totalImpressions.toLocaleString('pt-BR') },
    { label: 'Alcance Único', value: options.metrics.totalReach.toLocaleString('pt-BR') },
    { label: 'Engajamento Total', value: options.metrics.totalEngagement.toLocaleString('pt-BR') },
    { label: 'Taxa de Engajamento', value: `${options.metrics.averageEngagementRate}%` },
  ];

  const colWidth = 42;
  const startX = 15;
  const startY = 82;

  kpis.forEach((kpi, idx) => {
    const x = startX + idx * (colWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, colWidth, 24, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(kpi.label.toUpperCase(), x + 4, startY + 8);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.text(kpi.value, x + 4, startY + 18);
  });

  // 4. Detalhes de Desempenho por Canal & Melhores Publicações
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.text('Desempenho da Carteira & Conteúdo Destaque', 15, 120);

  // Tabela Simples Vetorial
  const tableStartY = 126;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, tableStartY, 180, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('INDICADOR', 20, tableStartY + 5.5);
  doc.text('VALOR CONSOLIDADO', 120, tableStartY + 5.5);

  const rows = [
    ['Total de Publicações Disparadas', `${options.metrics.postsPublishedCount} posts`],
    ['Novos Seguidores Conquistados', `+${options.metrics.newFollowers.toLocaleString('pt-BR')}`],
    ['Canal com Maior Retenção', options.metrics.topPerformingChannel],
    ['Publicação de Maior Sucesso', options.metrics.topPostTitle],
    ['Engajamento no Post Top', `${options.metrics.topPostEngagementRate}%`],
  ];

  let currentY = tableStartY + 8;
  rows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY, 180, 7, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(row[0], 20, currentY + 5);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], 120, currentY + 5);
    currentY += 7;
  });

  // 5. Rodapé
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 275, 195, 275);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Relatório emitido automaticamente por HupFlow Clean Social Studio — Confidencial', 15, 282);
  doc.text('Página 1 de 1', 178, 282);

  return doc;
}
