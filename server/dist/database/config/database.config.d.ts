declare const _default: (() => {
    host: string;
    port: number;
    user: string;
    password: string | undefined;
    database: string;
    ssl: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    user: string;
    password: string | undefined;
    database: string;
    ssl: boolean;
}>;
export default _default;
