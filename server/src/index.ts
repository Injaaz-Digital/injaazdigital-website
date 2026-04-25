import { COMPONENT_SAFE_MODELS, CONTENT_UID } from './content-system/models';

type UnknownRecord = Record<string, unknown>;

type ComponentAttribute = {
  type: 'component';
  component: string;
  repeatable?: boolean;
};

type DynamicZoneAttribute = {
  type: 'dynamiczone';
};

type ModelAttribute = {
  type?: string;
  component?: string;
  repeatable?: boolean;
};

type ModelSchema = {
  attributes?: Record<string, ModelAttribute>;
};

const isRecord = (value: unknown): value is UnknownRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const sanitizeDynamicZone = (
  value: unknown,
  strapi: { getModel: (uid: string) => ModelSchema | undefined }
): unknown => {
  if (!Array.isArray(value)) {
    return value;
  }

  return value.map((item) => {
    if (!isRecord(item)) {
      return item;
    }

    const sanitized: UnknownRecord = { ...item };
    delete sanitized.id;

    const componentUid = typeof sanitized.__component === 'string' ? sanitized.__component : null;
    if (!componentUid) {
      return sanitized;
    }

    return sanitizeByModel(componentUid, sanitized, strapi);
  });
};

const sanitizeComponent = (
  attribute: ComponentAttribute,
  value: unknown,
  strapi: { getModel: (uid: string) => ModelSchema | undefined }
): unknown => {
  if (attribute.repeatable) {
    if (!Array.isArray(value)) {
      return value;
    }

    return value.map((item) => {
      if (!isRecord(item)) {
        return item;
      }

      const sanitized: UnknownRecord = { ...item };
      delete sanitized.id;
      return sanitizeByModel(attribute.component, sanitized, strapi);
    });
  }

  if (!isRecord(value)) {
    return value;
  }

  const sanitized: UnknownRecord = { ...value };
  delete sanitized.id;
  return sanitizeByModel(attribute.component, sanitized, strapi);
};

function sanitizeByModel(
  modelUid: string,
  data: UnknownRecord,
  strapi: { getModel: (uid: string) => ModelSchema | undefined }
): UnknownRecord {
  const model = strapi.getModel(modelUid);
  const attributes = model?.attributes;

  if (!attributes) {
    return data;
  }

  const nextData: UnknownRecord = { ...data };

  Object.entries(attributes).forEach(([fieldName, attribute]) => {
    if (!(fieldName in nextData)) {
      return;
    }

    if (attribute.type === 'component' && typeof attribute.component === 'string') {
      nextData[fieldName] = sanitizeComponent(attribute as ComponentAttribute, nextData[fieldName], strapi);
      return;
    }

    if (attribute.type === 'dynamiczone') {
      nextData[fieldName] = sanitizeDynamicZone(nextData[fieldName], strapi);
      return;
    }
  });

  return nextData;
}

export default {
  register() {},

  async bootstrap({ strapi }) {
    const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });

    if (publicRole?.id) {
      const permissionQuery = strapi.db.query('plugin::users-permissions.permission');
      const publicReadActions = [
        `${CONTENT_UID.siteSetting}.find`,
        `${CONTENT_UID.homePage}.find`,
        `${CONTENT_UID.growthEnginePage}.find`,
        `${CONTENT_UID.webStudioPage}.find`,
        `${CONTENT_UID.aboutPage}.find`,
        `${CONTENT_UID.blogPage}.find`,
        `${CONTENT_UID.page}.find`,
        `${CONTENT_UID.page}.findOne`,
        `${CONTENT_UID.article}.find`,
        `${CONTENT_UID.article}.findOne`,
        `${CONTENT_UID.author}.find`,
        `${CONTENT_UID.author}.findOne`,
        `${CONTENT_UID.tag}.find`,
        `${CONTENT_UID.tag}.findOne`,
        'api::lead-question.lead-question.find',
        'api::lead-question.lead-question.findOne',
      ];

      for (const action of publicReadActions) {
        const existing = await permissionQuery.findOne({
          where: {
            action,
            role: publicRole.id,
          },
        });

        if (existing?.id) {
          if (!existing.enabled) {
            await permissionQuery.update({
              where: { id: existing.id },
              data: { enabled: true },
            });
          }
          continue;
        }

        await permissionQuery.create({
          data: {
            action,
            role: publicRole.id,
            enabled: true,
          },
        });
      }
    }

    strapi.documents.use(async (context, next) => {
      if (!COMPONENT_SAFE_MODELS.has(context.uid)) {
        return next();
      }

      if (!isRecord(context.params?.data)) {
        return next();
      }

      context.params.data = sanitizeByModel(context.uid, context.params.data as UnknownRecord, strapi);
      return next();
    });
  },
};
