import {z, ZodTypeAny} from "zod";

const AuditLog = z.object({
    action: z.string().optional(),
    createdAt: z.string().optional(),
    entityId: z.string().optional(),
    entityType: z.string().optional(),
    id: z.number().int(),
    status: z.string(),
    userId: z.string().optional()
}).passthrough();
const Error = z.object({
    code: z.string(),
    details: z.object({}).partial().passthrough().optional(),
    message: z.string()
}).passthrough();
const AuditLogCreate = z.object({
    action: z.string(),
    entityId: z.string(),
    entityType: z.string(),
    status: z.string(),
    userId: z.string().optional()
}).passthrough();
const ChatHistory = z.object({
    createdAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    messages: z.string(),
    modelId: z.string().optional(),
    presetId: z.string().optional(),
    updatedAt: z.string().datetime({offset: true}).optional(),
    userId: z.string()
}).passthrough();
const ChatHistoryCreate = z.object({
    messages: z.string(),
    modelId: z.string().optional(),
    presetId: z.string().optional(),
    userId: z.string()
}).passthrough();
const Chunk = z.object({
    checksum: z.string().optional(),
    chunkIndex: z.number().int(),
    content: z.string(),
    createdAt: z.string().datetime({offset: true}).optional(),
    documentId: z.string(),
    id: z.number().int(),
    tokenCount: z.number().int().optional()
}).passthrough();
const ChunkCreate = z.object({
    checksum: z.string().optional(),
    chunkIndex: z.number().int(),
    content: z.string(),
    documentId: z.string(),
    tokenCount: z.number().int().optional()
}).passthrough();
const Document = z.object({
    aclGroup: z.string().optional(),
    author: z.string().optional(),
    createdAt: z.string().datetime({offset: true}).optional(),
    docType: z.string().optional(),
    id: z.number().int(),
    isActive: z.boolean().optional(),
    sourceUrl: z.string().optional(),
    title: z.string(),
    updatedAt: z.string().datetime({offset: true}).optional(),
    uploadedBy: z.string().optional(),
    version: z.string().optional()
}).passthrough();
const DocumentCreate = z.object({
    aclGroup: z.string().optional(),
    author: z.string().optional(),
    docType: z.string().optional(),
    isActive: z.boolean().optional(),
    sourceUrl: z.string().optional(),
    title: z.string(),
    version: z.string().optional()
}).passthrough();
const Embedding = z.object({
    chunkId: z.string(),
    createdAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    vector: z.string()
}).passthrough();
const EmbeddingCreate = z.object({chunkId: z.string(), vector: z.string()}).passthrough();
const IngestionJob = z.object({
    documentId: z.string(),
    errorMessage: z.string().optional(),
    finishedAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    retryCount: z.number().int().optional(),
    startedAt: z.string().datetime({offset: true}).optional(),
    status: z.string(),
    userId: z.string().optional()
}).passthrough();
const IngestionJobCreate = z.object({
    documentId: z.string(),
    errorMessage: z.string().optional(),
    finishedAt: z.string().datetime({offset: true}).optional(),
    retryCount: z.number().int().optional(),
    startedAt: z.string().datetime({offset: true}).optional(),
    status: z.string(),
    userId: z.string().optional()
}).passthrough();
const IngestionStep = z.object({
    durationMs: z.number().int().optional(),
    errorMessage: z.string().optional(),
    finishedAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    jobId: z.string(),
    startedAt: z.string().datetime({offset: true}).optional(),
    status: z.string(),
    stepName: z.string()
}).passthrough();
const IngestionStepCreate = z.object({
    durationMs: z.number().int().optional(),
    errorMessage: z.string().optional(),
    finishedAt: z.string().datetime({offset: true}).optional(),
    jobId: z.string(),
    startedAt: z.string().datetime({offset: true}).optional(),
    status: z.string(),
    stepName: z.string()
}).passthrough();
const LoginRequest = z.object({password: z.string(), username: z.string()}).passthrough();
const LoginResponse = z.object({
    access_token: z.string(),
    expires_in: z.number().int(),
    refresh_token: z.string(),
    token_type: z.string()
}).partial().passthrough();
const Model = z.object({
    categoryId: z.string(),
    createdAt: z.string().datetime({offset: true}).optional(),
    description: z.string().optional(),
    id: z.number().int(),
    name: z.string(),
    updatedAt: z.string().datetime({offset: true}).optional()
}).passthrough();
const ModelCreate = z.object({
    categoryId: z.string(),
    description: z.string().optional(),
    name: z.string()
}).passthrough();
const Preset = z.object({
    config: z.string(),
    createdAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    name: z.string(),
    updatedAt: z.string().datetime({offset: true}).optional(),
    userId: z.string()
}).passthrough();
const PresetCreate = z.object({config: z.string(), name: z.string(), userId: z.string()}).passthrough();
const Query = z.object({
    createdAt: z.string().datetime({offset: true}).optional(),
    id: z.number().int(),
    queryText: z.string(),
    responseText: z.string().optional(),
    topK: z.number().int(),
    userId: z.string()
}).passthrough();
const QueryCreate = z.object({
    queryText: z.string(),
    responseText: z.string().optional(),
    topK: z.number().int(),
    userId: z.string()
}).passthrough();
const QueryChunkMatch = z.object({
    chunkId: z.string(),
    queryId: z.string(),
    rank: z.number().int(),
    score: z.number()
}).passthrough();
const QueryChunkMatchCreate = z.object({
    chunkId: z.string(),
    queryId: z.string(),
    rank: z.number().int(),
    score: z.number()
}).passthrough();
const Role = z.object({description: z.string().optional(), id: z.number().int(), name: z.string()}).passthrough();
const RoleCreate = z.object({description: z.string().optional(), name: z.string()}).passthrough();
const Session = z.object({
    createdAt: z.string().datetime({offset: true}).optional(),
    expiresAt: z.string().datetime({offset: true}),
    id: z.number().int(),
    revokedAt: z.string().datetime({offset: true}).optional(),
    token: z.string(),
    userId: z.string()
}).passthrough();
const SessionCreate = z.object({
    expiresAt: z.string().datetime({offset: true}),
    token: z.string(),
    userId: z.string()
}).passthrough();
const User = z.object({
    createdAt: z.string().datetime({offset: true}).optional(),
    email: z.string(),
    fullName: z.string().optional(),
    id: z.number().int(),
    isActive: z.boolean().optional(),
    passwordHash: z.string(),
    roles: z.array(z.string()).optional(),
    updatedAt: z.string().datetime({offset: true}).optional(),
    username: z.string()
}).passthrough();
const UserCreate = z.object({
    email: z.string(),
    fullName: z.string().optional(),
    isActive: z.boolean().optional(),
    password: z.string().optional(),
    roles: z.array(z.string()).optional(),
    username: z.string()
}).passthrough();

export const schemas = {
    AuditLog,
    Error,
    AuditLogCreate,
    ChatHistory,
    ChatHistoryCreate,
    Chunk,
    ChunkCreate,
    Document,
    DocumentCreate,
    Embedding,
    EmbeddingCreate,
    IngestionJob,
    IngestionJobCreate,
    IngestionStep,
    IngestionStepCreate,
    LoginRequest,
    LoginResponse,
    Model,
    ModelCreate,
    Preset,
    PresetCreate,
    Query,
    QueryCreate,
    QueryChunkMatch,
    QueryChunkMatchCreate,
    Role,
    RoleCreate,
    Session,
    SessionCreate,
    User,
    UserCreate,
};

export type FormColumnConfig = {
    // Either `id` (special column) or `accessorKey` (standard field)
    id?: "drag" | "select" | "actions";
    accessorKey?: string;
    // Display
    label?: string;   // for forms
    header?: string;  // for table headers

    // Type of field
    type:
        | "drag"
        | "select-all"
        | "multi-select"
        | "actions"
        | "header"
        | "badge"
        | "status"
        | "number-input"
        | "select"
        | "text-area"
        | "file-upload"
        | "date-picker"
        | "radio"
        | "input";

    width?: "full" | "half";
    options?: { id: string | number; label: string }[];
};

export function schemaToColumns<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>
): FormColumnConfig[] {
    const shape = schema.shape
    let options: { id: string | number; label: string }[] = []

    // map schema fields to FormColumnConfig
    const mapped: FormColumnConfig[] = Object.entries(shape).map(([key, def]) => {
        const baseType = unwrap(def)
        let type: FormColumnConfig["type"]

        if (baseType instanceof z.ZodString) {
            if (baseType._def.checks?.some((c) => c.kind === "datetime")) {
                type = "date-picker"
            } else {
                type = "input"
            }
        } else if (baseType instanceof z.ZodNumber) {
            type = "number-input"
            } else if (baseType instanceof z.ZodBoolean) {
            type = "radio"
        } else if (
            baseType instanceof z.ZodArray &&
            baseType._def.type instanceof z.ZodString
        ) {
            type = "multi-select"
            options = [
                {id: "admin", label: "admin"},
                {id: "editor", label: "editor"},
            ]
        } else {
            type = "input"
        }

        return {
            id: key,
            accessorKey: key,
            header: toHeader(key),
            label: toHeader(key),
            type,
            options,
            width: "half",
        } as FormColumnConfig
    })

    // find id column if exists
    const idCol = mapped.find((c) => String(c.accessorKey).toLowerCase() === "id")

    // filter out id from mapped so we can reposition
    const withoutId = mapped.filter(
        (c) => String(c.accessorKey).toLowerCase() !== "id"
    )

    // build final ordered list
    const final: FormColumnConfig[] = []

    // 1. drag column
    final.push({
        id: "drag",
        header: "",
        type: "drag",
    })
    // 2. select column
    final.push({
        id: "select",
        header: "",
        type: "select-all",

    })

    // 3. id column (if exists)
    if (idCol) {
        // force type to "header"
        idCol.type = "header"
        final.push(idCol)
    }

    // 4. remaining schema-derived columns
    final.push(...withoutId)

    // 5. actions column
    final.push({
        id: "actions",
        header: "Actions",
        type: "actions",
    })

    return final
}

/**
 * Unwrap optional/nullable types
 */
function unwrap(def: ZodTypeAny): ZodTypeAny {
    let current = def;
    while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
        current = current._def.innerType;
    }
    return current;
}

/**
 * Convert camelCase or snake_case keys into readable headers
 */
function toHeader(key: string) {
    return key
        .replace(/([A-Z])/g, " $1") // split camelCase
        .replace(/_/g, " ") // replace underscores
        .replace(/^./, (s) => s.toUpperCase())
}
