import { MiddlewareFunction } from 'middy';
import { EncryptionAlgorithms, IAuthOptions, isAuthOptions } from './interfaces/IAuthOptions';
import { IAuthorizedEvent } from './interfaces/IAuthorizedEvent';
/** The actual middleware */
export declare class JWTAuthMiddleware {
    private options;
    static create(options: IAuthOptions): JWTAuthMiddleware;
    /** The logger used in the module */
    private readonly logger;
    /** Creates a new JWT Auth middleware */
    constructor(options: IAuthOptions);
    /**
     * Checks for an authentication token, saves its content to event.auth and throws errors if anything fishy goes on.
     * It will pass if no authorization header is present, but will ensure that event.auth is undefined in those cases.
     * Authorization or authorization headers will both be checked. If both exist, the middleware will throw an error.
     * @param event - The event to check
     */
    before: MiddlewareFunction<IAuthorizedEvent, any>;
}
declare const _default: typeof JWTAuthMiddleware.create;
export default _default;
export { EncryptionAlgorithms, IAuthOptions, isAuthOptions };
export { IAuthorizedEvent, isAuthorizedEvent } from './interfaces/IAuthorizedEvent';
