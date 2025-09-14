import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Security & Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Welcome to FindIt! Your privacy and the security of your information are very important to us. This policy outlines how we collect, use, and protect your data when you use our application.
          </p>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">1. Information We Collect</h2>
            <p>We collect information to provide and improve our service. This includes:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Account Information:</strong> When you create an account, we collect your name and email address.</li>
              <li><strong>Item Information:</strong> When you report a lost or found item, we collect the details you provide, such as the item's name, description, location, and uploaded images.</li>
              <li><strong>Communication:</strong> We store the messages you exchange with other users through our chat feature to facilitate communication about lost and found items.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">2. How We Use Your Information</h2>
            <p>Your information is used solely to operate the FindIt service:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>To display lost and found item listings to the RGUKT community.</li>
              <li>To allow users to contact each other to arrange for the return of items.</li>
              <li>To analyze trends in lost and found items via our anonymous admin dashboard to help improve campus services.</li>
              <li>To improve our AI models for features like image matching and description generation. All data used for AI training is handled securely.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">3. Data Security</h2>
            <p>
              We are committed to protecting your information. We implement a variety of security measures to maintain the safety of your personal data. All data is stored on secure servers, and communication between the app and our servers is encrypted. Access to personal user data is strictly limited to authorized personnel who are required to keep the information confidential.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">4. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. Your information is only shared within the app to facilitate the return of lost items. For example, your name may be visible to another user when you chat with them. We will never share your email address with other users.
            </p>
          </div>

           <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">5. Your Consent</h2>
            <p>
              By using our app, you consent to our privacy policy.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">6. Changes to Our Privacy Policy</h2>
            <p>
              If we decide to change our privacy policy, we will post those changes on this page. This policy was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold font-headline text-foreground">Contact Us</h2>
            <p>
              If you have any questions regarding this privacy policy, you may contact us using the information on our Contact page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
