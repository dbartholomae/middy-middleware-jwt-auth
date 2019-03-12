import { MiddlewareFunction } from 'middy';
import { EncryptionAlgorithms, IAuthOptions, isAuthOptions } from './interfaces/IAuthOptions';
import { IAuthorizedEvent } from './interfaces/IAuthorizedEvent';
/** The actual middleware */
export declare class JWTAuthMiddleware<Payload> {
    private options;
    static create<Payload = any>(options: IAuthOptions<Payload>): JWTAuthMiddleware<Payload>;
    /** The logger used in the module */
    private readonly logger;
    /** Creates a new JWT Auth middleware */
    constructor(options: IAuthOptions<Payload>);
    /**
     * Checks for an authentication token, saves its content to event.auth and throws errors if anything fishy goes on.
     * It will pass if no authorization header is present, but will ensure that event.auth is undefined in those cases.
     * Authorization or authorization headers will both be checked. If both exist, the middleware will throw an error.
     * If options.tokenSource is set, then that function will be used to retrieve the token and Headers will serve as
     * fallback.
     * @param event - The event to check
     */
    before: MiddlewareFunction<IAuthorizedEvent, any>;
    /** Extracts a token from an authorization header. */
    private getTokenFromAuthHeader;
    /** Extracts a token from a source defined in the options. */
    private getTokenFromSource;
}
declare const _default: typeof JWTAuthMiddleware.create;
export default _default;
export { EncryptionAlgorithms, IAuthOptions, isAuthOptions };
export { IAuthorizedEvent, isAuthorizedEvent } from './interfaces/IAuthorizedEvent';
