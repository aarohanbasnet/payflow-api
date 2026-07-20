import {z} from "zod"

export const registerUserSchema = z.object({
    name : z.string().min(4, "name must be at least 4 characters")
    .max(50, "Name cannot exceed 50 characters"),

    email : z.email("Invalid email address")
    .trim()
    .toLowerCase(),

    phone : z.string().trim().regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),

    password : z.string().min(8, "Password must be atleast 8 characters")
});


export const loginUserSchema = z.object({
    identifier : z.string().trim().min(1, "Phone number or username is required"),
    password : z.string().min(1, "password is required")
    .optional(),

    mpin : z.string().length(4, "MPIN must be exactly 4 digits")
    .optional()
})
.refine(
    (data) => 
    (data.password && data.mpin) ||
    (!data.password && !data.mpin),
    {
        message : "Provide either password or MPIN",
        path : ["password"],  //which filed should receive error
    }
)