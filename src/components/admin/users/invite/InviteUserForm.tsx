
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInvitations } from "@/hooks/useInvitations";
import { useRoles } from "@/hooks/useRoles";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Please select a role"),
  department: z.string().optional(),
});

interface InviteUserFormProps {
  onSuccess: () => void;
}

export function InviteUserForm({ onSuccess }: InviteUserFormProps) {
  const { createInvitation, getInvitationsByEmail } = useInvitations();
  const { roles, loading: rolesLoading } = useRoles(true);
  const { departments, loading: departmentsLoading } = useDepartments();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      department: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Check if user already has a pending invitation
      const { data: existingInvitation } = await getInvitationsByEmail(values.email);
      
      if (existingInvitation) {
        toast.error("This email already has a pending invitation");
        return;
      }

      // Create new invitation (convert "none" to empty string for department)
      const departmentId = values.department === "none" ? "" : (values.department || "");
      
      const { data, error } = await createInvitation(
        values.email, 
        values.role, 
        departmentId
      );
      
      if (error) {
        console.error('Invitation error:', error);
        toast.error("Failed to send invitation");
        return;
      }

      // Generate invitation link
      const invitationLink = `${window.location.origin}/signup?token=${data.token}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(invitationLink);

      toast.success("Invitation created! Link copied to clipboard. Share it with the user.");
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error("Invitation error:", error);
    }
  };

  const loading = rolesLoading || departmentsLoading;

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Sending...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
