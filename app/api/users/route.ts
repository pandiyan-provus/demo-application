import {
  CreateUserSchema,
  type CreateUserRequest,
  type UserResponse,
  type ErrorResponse,
} from "./models";

const users: UserResponse[] = [
  { id: 1, name: "Ravi Kumar", email: "ravi@example.com", createdAt: "2024-01-15" },
  { id: 2, name: "Priya Singh", email: "priya@example.com", createdAt: "2024-02-20" },
];

export async function GET(): Promise<Response> {
  return Response.json(users);
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = CreateUserSchema.safeParse(body);

    if (!result.success) {
      const errorResponse: ErrorResponse = {
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      };

      return Response.json(errorResponse, { status: 400 });
    }

    const validData: CreateUserRequest = result.data;

    const newUser: UserResponse = {
      id: users.length + 1,
      name: validData.name,
      email: validData.email,
      createdAt: new Date().toISOString().split("T")[0],
    };

    users.push(newUser);

    return Response.json(newUser, { status: 201 });
  } catch {
    const errorResponse: ErrorResponse = {
      error: "Invalid JSON body",
    };
    return Response.json(errorResponse, { status: 400 });
  }
}
