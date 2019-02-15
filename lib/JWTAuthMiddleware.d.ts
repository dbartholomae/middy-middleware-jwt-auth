import { MiddlewareFunction } from 'middy';
import { IAuthorizedEvent } from './interfaces/IAuthorizedEvent';
import { EncryptionAlgorithms, IAuthOptions, isAuthOptions } from './interfaces/IAuthOptions';
/** The actual middleware */
export declare class JWTAuthMiddleware {
    private options;
    /** The logger used in the module */
    private readonly logger;
    static create(options: IAuthOptions): JWTAuthMiddleware;
    /** Creates a new JWT Auth middleware */
    constructor(options: IAuthOptions);
    /**
     * Checks for an authentication token, saves its content to event.auth and throws errors if anything fishy goes on.
     * It will pass if no authorization header is present, but will ensure that event.auth is undefined in those cases.
     * @param event - The event to check
     */
    before: MiddlewareFunction<IAuthorizedEvent, any>;
}
declare const _default: typeof JWTAuthMiddleware.create;
export default _default;
export { EncryptionAlgorithms, IAuthOptions, isAuthOptions };
export { IAuthorizedEvent, isAuthorizedEvent } from './interfaces/IAuthorizedEvent';
