import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setBasePath('v1')
    .setTitle('Forum')
    .setDescription('The forum API description')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'authorization' },
      'session-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
};
