import {
  Logger,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from '@copilotkit/runtime';
import {
  CopywriterDto,
  CopywriterResult,
} from '@gitroom/nestjs-libraries/dtos/generator/copywriter.dto';
import { ChatOpenAI } from '@langchain/openai';
import { GetOrgFromRequest } from '@gitroom/nestjs-libraries/user/org.from.request';
import { Organization } from '@prisma/client';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { MastraAgent } from '@ag-ui/mastra';
import { MastraService } from '@gitroom/nestjs-libraries/chat/mastra.service';
import { Request, Response } from 'express';
import { RequestContext } from '@mastra/core/di';
import { CheckPolicies } from '@gitroom/backend/services/auth/permissions/permissions.ability';
import { AuthorizationActions, Sections } from '@gitroom/backend/services/auth/permissions/permission.exception.class';

export type ChannelsContext = {
  integrations: string;
  organization: string;
  ui: string;
};

// the copilot runtime writes its own CORS headers on the response, keep them aligned with main.ts
const copilotCors = () => ({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:6274',
    ...(process.env.MAIN_URL ? [process.env.MAIN_URL] : []),
  ],
  credentials: !process.env.NOT_SECURED,
});

@Controller('/copilot')
export class CopilotController {
  constructor(
    private _subscriptionService: SubscriptionService,
    private _mastraService: MastraService
  ) {}
  @Post('/chat')
  chatAgent(@Req() req: Request, @Res() res: Response) {
    if (
      process.env.OPENAI_API_KEY === undefined ||
      process.env.OPENAI_API_KEY === ''
    ) {
      Logger.warn('OpenAI API key not set, chat functionality will not work');
      return;
    }

    const copilotRuntimeHandler = copilotRuntimeNodeHttpEndpoint({
      endpoint: '/copilot/chat',
      cors: copilotCors(),
      runtime: new CopilotRuntime(),
      serviceAdapter: new OpenAIAdapter({
        model: 'gpt-4.1',
      }),
    });

    return copilotRuntimeHandler(req, res);
  }

  @Post('/agent')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async agent(
    @Req() req: Request,
    @Res() res: Response,
    @GetOrgFromRequest() organization: Organization
  ) {
    if (
      process.env.OPENAI_API_KEY === undefined ||
      process.env.OPENAI_API_KEY === ''
    ) {
      Logger.warn('OpenAI API key not set, chat functionality will not work');
      return;
    }
    const mastra = await this._mastraService.mastra();
    const requestContext = new RequestContext<ChannelsContext>();
    requestContext.set(
      'integrations',
      req?.body?.body?.forwardedProps?.integrations || []
    );

    requestContext.set('organization', JSON.stringify(organization));
    requestContext.set('ui', 'true');

    const agents = MastraAgent.getLocalAgents({
      resourceId: organization.id,
      mastra,
      requestContext: requestContext as any,
    });

    const runtime = new CopilotRuntime({
      agents,
    });

    const copilotRuntimeHandler = copilotRuntimeNodeHttpEndpoint({
      endpoint: '/copilot/agent',
      cors: copilotCors(),
      runtime,
      serviceAdapter: new OpenAIAdapter({
        model: 'gpt-4.1',
      }),
    });

    return copilotRuntimeHandler(req, res);
  }

  @Get('/credits')
  calculateCredits(
    @GetOrgFromRequest() organization: Organization,
    @Query('type')
    type: 'ai_images' | 'ai_videos' | 'clipping_minutes'
  ) {
    return this._subscriptionService.checkCredits(
      organization,
      type || 'ai_images'
    );
  }

  @Get('/:thread/list')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async getMessagesList(
    @GetOrgFromRequest() organization: Organization,
    @Param('thread') threadId: string
  ): Promise<any> {
    const mastra = await this._mastraService.mastra();
    const memory = await mastra.getAgent('postiz').getMemory();
    try {
      return await memory.recall({
        resourceId: organization.id,
        threadId,
      });
    } catch (err) {
      Logger.warn(`Could not recall messages for thread ${threadId}: ${err}`);
      return { messages: [] };
    }
  }

  @Get('/list')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async getList(@GetOrgFromRequest() organization: Organization) {
    const mastra = await this._mastraService.mastra();
    const memory = await mastra.getAgent('postiz').getMemory();
    const list = await memory.listThreads({
      filter: { resourceId: organization.id },
      perPage: 100000,
      page: 0,
      orderBy: { field: 'createdAt', direction: 'DESC' },
    });

    return {
      threads: list.threads.map((p) => ({
        id: p.id,
        title: p.title,
      })),
    };
  }

  @Post('/copywriter')
  @CheckPolicies([AuthorizationActions.Create, Sections.AI])
  async generateCopywriting(
    @Body() body: CopywriterDto,
    @GetOrgFromRequest() organization: Organization
  ): Promise<CopywriterResult> {
    const platform = body.platform || 'generic';
    const tone = body.tone || 'engaging';
    const mode = body.mode || 'caption';
    const topic = body.topic || '';
    const content = body.content || '';
    const instruction = body.customInstruction || '';

    const platformTips: Record<string, string> = {
      linkedin: 'No LinkedIn, comece com um gancho forte na 1ª linha, deixe linhas em branco para respirabilidade e termine com uma pergunta aberta convidando a comentários.',
      x: 'No X (Twitter), seja direto e contundente. Use até 280 caracteres por post, 1 a 2 hashtags no máximo e um call-to-action imediato.',
      instagram: 'No Instagram, use uma introdução visual impactante, emojis equilibrados, incentivo para salvar ou compartilhar e agrupe as hashtags no final.',
      threads: 'No Threads, priorize tom conversacional, pensamentos autênticos e perguntas que instiguem respostas da comunidade.',
      facebook: 'No Facebook, crie narrativas relacionáveis e voltadas para conexão social ou debate comunitário.',
      generic: 'Mantenha clareza, gancho atrativo no início e termine com chamada para engajamento.',
    };

    const promptPlatform = {
      linkedin: 'LinkedIn (formatação com espaçamento limpo, tom profissional/inspirador, lições práticas, 3-5 hashtags profissionais)',
      x: 'X/Twitter (extremamente conciso, persuasivo, limite de 280 caracteres, máx 2 hashtags)',
      instagram: 'Instagram (legenda atrativa com emojis expressivos, CTA para salvar/comentar, bloco com 5-8 hashtags)',
      threads: 'Threads (informal, pensamento autêntico, convite à conversa, tom descontraído)',
      facebook: 'Facebook (comunitário, amigável, narrativa e debate)',
      generic: 'Redes Sociais em geral',
    }[platform];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '') {
      try {
        const model = new ChatOpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.7,
        });

        const systemMessage = `Você é um Copywriter especialista em mídias sociais de alta performance.
Sua missão é criar ou aprimorar posts para a plataforma: ${promptPlatform}.
Tom de voz desejado: ${tone}.
Modo de geração: ${mode}.
${instruction ? `Instrução especial: ${instruction}` : ''}

Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown de código ao redor, apenas o JSON bruto) com este schema exato:
{
  "caption": "texto completo formatado da legenda/post",
  "hooks": ["gancho alternativo 1", "gancho alternativo 2", "gancho alternativo 3"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
  "platformTip": "dica rápida de melhoria para esta rede"
}`;

        const userPrompt = content
          ? `Melhore e otimize o seguinte post existente mantendo o assunto central:\n"""\n${content}\n"""\n${topic ? `Tópico/Diretriz: ${topic}` : ''}`
          : `Crie um post engajador a partir da seguinte ideia/tópico:\n"""\n${topic || 'Dicas de produtividade e tecnologia'}\n"""`;

        const response = await model.invoke([
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt },
        ]);

        const rawText = typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);

        const cleanJson = rawText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const parsed = JSON.parse(cleanJson);
        return {
          caption: parsed.caption || content || topic,
          hooks: Array.isArray(parsed.hooks) && parsed.hooks.length > 0
            ? parsed.hooks
            : ['Descubra como transformar seus resultados hoje.', 'O maior erro que muitos cometem e como evitar.', 'Se você quer crescer mais rápido, preste atenção nisto.'],
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ['#socialmedia', '#marketing', '#growth'],
          platformTip: parsed.platformTip || platformTips[platform] || platformTips.generic,
        };
      } catch (err) {
        Logger.warn(`OpenAI copywriting request failed, falling back to heuristic templates: ${err}`);
      }
    }

    // Fallback inteligente caso OpenAI não esteja configurada ou ocorra erro
    const baseTopic = topic || content || 'Novidades e aprendizados';
    const fallbackHooks = [
      `🔥 Se você quer dominar ${baseTopic}, comece por aqui:`,
      `Pare de complicar ${baseTopic}. Aqui está a regra simples:`,
      `O que ninguém te conta sobre ${baseTopic} (e por que importa agora):`,
    ];

    let fallbackCaption = '';
    if (content) {
      fallbackCaption = `${fallbackHooks[0]}\n\n${content}\n\nConcorda com isso? Me conta aqui nos comentários!`;
    } else {
      fallbackCaption = `${fallbackHooks[0]}\n\n1. Foque no que traz 80% do resultado com 20% do esforço.\n2. Mantenha consistência diária em vez de picos isolados.\n3. Meça o progresso e adapte a rota rápido.\n\nQual tem sido o seu maior desafio com isso ultimamente?`;
    }

    const defaultTagsByPlatform: Record<string, string[]> = {
      linkedin: ['#Lideranca', '#Produtividade', '#Negocios', '#Carreira', '#Inovacao'],
      x: ['#Tech', '#Growth', '#Dicas'],
      instagram: ['#Empreendedorismo', '#MarketingDigital', '#Produtividade', '#Criatividade', '#Estrategia'],
      threads: ['#Conversa', '#Ideias', '#Reflexao'],
      facebook: ['#Comunidade', '#Dicas', '#Compartilhe'],
      generic: ['#Marketing', '#Inovacao', '#Crescimento', '#Produtividade'],
    };

    return {
      caption: fallbackCaption,
      hooks: fallbackHooks,
      hashtags: defaultTagsByPlatform[platform] || defaultTagsByPlatform.generic,
      platformTip: platformTips[platform] || platformTips.generic,
    };
  }
}
