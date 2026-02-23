
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationsList } from "@/components/admin/locations/LocationsList";
import { CompanyInfoForm } from "@/components/admin/company/CompanyInfoForm";

export default function CompanySetup() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Company Setup</h1>
        <p className="text-gray-600 mt-2">Configure company information and manage locations</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company's basic information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <LocationsList />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Preferences</CardTitle>
              <CardDescription>
                Configure your company's preferences and default settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Preferences configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
