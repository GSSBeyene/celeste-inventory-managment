import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { Clock, Shield, LogOut } from "lucide-react";

export const PendingApprovalScreen = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Account Pending Approval
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Your account has been created successfully but needs admin approval before you can access the hotel inventory management system.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Security Notice</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This system requires admin approval for security purposes. A hotel administrator will review and approve your account within 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">What happens next?</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                <span>An admin will review your account details</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                <span>You'll receive an email once approved</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></span>
                <span>You can then log in and access the system</span>
              </li>
            </ul>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};