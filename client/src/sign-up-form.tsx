import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { authClient } from "./lib/auth-client";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 5 characters.")
    .max(32, "Name must be at most 32 characters."),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export default function SignUpForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof formSchema> }) => {
      await authClient.signUp.email(
        {
          email: value.email, // user email address
          password: value.password, // user password -> min 8 characters by default
          name: value.name, // user display name
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful! Please check your email to verify.");
          },
          onError: (ctx) => {
            // display the error message
            toast.error(`Sign up failed: ${ctx.error.message}`);
          },
        }
      );
    },
  });

  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h2>Sign Up</h2>
      <form
        id="bug-report-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="your name"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="email"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="password"
                    autoComplete="off"
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Field orientation="horizontal" className="mt-4">
              <Button type="submit" disabled={isSubmitting} variant="default">
                {isSubmitting ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
