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

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 5 characters.")
    .max(32, "Name must be at most 32 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  price: z.number().min(0.01, "Price must be greater than 0."),
});

export default function AddItemForm({ onAdd }: { onAdd: () => void }) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }: { value: z.infer<typeof formSchema> }) => {
      fetch("http://localhost:3000/item", {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json();
            if (response.status === 500) {
              throw new Error(error.message);
            }
            if (error?.error?.name === "ZodError") {
              // server form validation error
              const messages = JSON.parse(error.error.message);
              throw new Error(
                messages.map((m: { message: string }) => m.message).join(", ")
              );
            }
            throw new Error("Unknown error");
          }
          return response.json();
        })
        .then((data) => {
          toast.success(data.message);
          onAdd();
        })
        .catch((error) => {
          console.log(error);
          if (error.message) {
            // server route rror (might be a database error)
            toast.error(error.message);
          } else {
            // unknown error
            toast.error("Failed to add item");
          }
        });
    },
  });

  return (
    <div className="border p-4 rounded-md flex flex-col gap-4">
      <h2>Add Item</h2>
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
                  <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="I'm having an issue with the login button on mobile."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={isInvalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.state.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="price"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      aria-invalid={isInvalid}
                    />
                  </InputGroup>
                  <FieldDescription>
                    Include steps to reproduce, expected behavior, and what
                    actually happened.
                  </FieldDescription>
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
