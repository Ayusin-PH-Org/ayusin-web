import { sign } from "hono/jwt";
import env from "@/env";

const generateTokens = async (
	userId: string,
	ttlAccessToken: number,
	ttlRefreshToken: number,
) => {
	const accessToken = await sign(
		{ sub: userId, exp: ttlAccessToken },
		env?.JWT_ACCESS_SECRET,
	);

	const refreshToken = await sign(
		{ sub: userId, exp: ttlRefreshToken },
		env?.JWT_REFRESH_SECRET,
	);

	return { accessToken, refreshToken };
};

export default generateTokens;
