import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

const DesignPage = () => {
  return (
    <div className="survey-layout flex">
      <div className="w-1/5"></div>
      <div className="w-3/5 bg-gray-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Questions</h1>
          <ul className="mt-4 flex justify-center">
            <li className="mr-4 cursor-pointer transition duration-300 hover:text-blue-500">
              Role 1
            </li>
            <li className="mr-4 cursor-pointer transition duration-300 hover:text-blue-500">
              Role 2
            </li>
            <li className="cursor-pointer transition duration-300 hover:text-blue-500">
              Role 3
            </li>
          </ul>
        </div>
        <div className="grid gap-4">
          {/* Question 1 */}
          <Card>
            <CardHeader>
              <CardTitle>
                Authenticatie (OAuth, OAuth2.0, SAML, OpenID, etc.)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">
                    👍 Used it &gt; Would use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">
                    👎 Used it &gt; Would not use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">
                    ✅ Heard of it &gt; Would like to learn
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-four" id="option-four" />
                  <Label htmlFor="option-four">
                    🚫 Heard of it &gt; Not interested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-five" id="option-five" />
                  <Label htmlFor="option-five">
                    ❓ Never heard of it/Not sure what it is
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Angular with Signals (new)</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">
                    👍 Used it &gt; Would use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">
                    👎 Used it &gt; Would not use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">
                    ✅ Heard of it &gt; Would like to learn
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-four" id="option-four" />
                  <Label htmlFor="option-four">
                    🚫 Heard of it &gt; Not interested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-five" id="option-five" />
                  <Label htmlFor="option-five">
                    ❓ Never heard of it/Not sure what it is
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Azure App Service</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">
                    👍 Used it &gt; Would use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">
                    👎 Used it &gt; Would not use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">
                    ✅ Heard of it &gt; Would like to learn
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-four" id="option-four" />
                  <Label htmlFor="option-four">
                    🚫 Heard of it &gt; Not interested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-five" id="option-five" />
                  <Label htmlFor="option-five">
                    ❓ Never heard of it/Not sure what it is
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Azure Chaos Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="option-one" />
                  <Label htmlFor="option-one">
                    👍 Used it &gt; Would use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="option-two" />
                  <Label htmlFor="option-two">
                    👎 Used it &gt; Would not use again
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-three" id="option-three" />
                  <Label htmlFor="option-three">
                    ✅ Heard of it &gt; Would like to learn
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-four" id="option-four" />
                  <Label htmlFor="option-four">
                    🚫 Heard of it &gt; Not interested
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-five" id="option-five" />
                  <Label htmlFor="option-five">
                    ❓ Never heard of it/Not sure what it is
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-1/5"></div>
    </div>
  );
};

export default DesignPage;
