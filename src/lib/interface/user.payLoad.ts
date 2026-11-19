
import type { JwtPayload } from "jsonwebtoken";

export interface TUserPayload extends JwtPayload {
    id: string;
    userName: string;
    email: string;
    role?: string;
}
