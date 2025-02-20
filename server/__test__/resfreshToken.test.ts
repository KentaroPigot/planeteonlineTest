import request from "supertest";
import app from "../app"; // Importez votre application Express
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../models";

describe("Refresh Token System", () => {
  let user: User;
  let refreshToken: string;
  let expiredAccessToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = "development";
    process.env.JWT_SECRET = "secretstring";
    process.env.JWT_EXPIRES_IN = "1h";
    process.env.JWT_COOKIE_EXPIRES_IN = "90";
    process.env.JWT_REFRESH_EXPIRES_IN = "7d";

    // Simuler la connexion de l'utilisateur existant pour obtenir le refreshToken
    const loginResponse = await request(app)
      .post("/api/v1/users/login")
      .send({ email: "test@example.com", password: "password123" });

    // // Vérifiez que set-cookie est défini et est un tableau
    // const setCookieHeader = loginResponse.headers["set-cookie"];
    // if (Array.isArray(setCookieHeader)) {
    //   const refreshTokenCookie = setCookieHeader.find((cookie) =>
    //     cookie.startsWith("refresh_token=")
    //   );
    //   if (refreshTokenCookie) {
    //     refreshToken = refreshTokenCookie.split(";")[0].split("=")[1];
    //   }
    // }

    // Générez un access token expiré
    expiredAccessToken = jwt.sign(
      { id: 1 }, // ID du user test qui existe dans la base de données.
      "secretstring",
      { expiresIn: "-1s" } // Expire immédiatement
    );
  });

  it("should return 401 if refresh token is missing", async () => {
    const response = await request(app)
      .post("/api/v1/tasks")
      .set("Cookie", [`auth_token=${expiredAccessToken}`]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Refresh token non défini. Connectez vous"
    );
  });

  it("should return 401 if refresh token is invalid", async () => {
    const invalidRefreshToken = jwt.sign({ id: 1 }, "wrong-secret", {
      expiresIn: "7d",
    });

    const response = await request(app)
      .post("/api/v1/tasks")
      .set("Cookie", [
        `auth_token=${expiredAccessToken}`,
        `refresh_token=${invalidRefreshToken}`,
      ]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Refresh Token invalide. Veuillez vous reconnecter"
    );
  });

  // it("should refresh the access token when it is expired", async () => {
  //   console.log(refreshToken);

  //   const response = await request(app)
  //     .post("/api/v1/tasks")
  //     .set("Cookie", [
  //       `auth_token=${expiredAccessToken}`,
  //       `refresh_token=${refreshToken}`,
  //     ]);

  //   expect(response.status).toBe(200);
  //   expect(response.headers["set-cookie"]).toBeDefined(); // Vérifiez qu'un nouveau cookie est défini
  // });

  it("should return 401 if refresh token does not match user", async () => {
    const signupResponse: any = await request(app)
      .post("/api/v1/users/signup")
      .send({
        name: "test2",
        firstname: "testtest2",
        email: "test2@example.com",
        password: "Test1234",
        passwordConfirm: "Test1234",
      });

    const response = await request(app)
      .post("/api/v1/tasks")
      .set("Cookie", [
        `auth_token=${expiredAccessToken}`,
        `refresh_token=another-refresh-token`, // refresh token d'un autre utilisateur
      ]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Refresh Token invalide. Veuillez vous reconnecter"
    );

    const deletedUser = await request(app).delete(
      `/api/v1/users/${signupResponse.body.data.user.id}`
    );
  });
});
