import {
  PrimaryButton,
  TextField,
  Text,
  Spinner,
  SpinnerSize,
  getTheme,
  Stack,
} from "@fluentui/react";
import { useState } from "react";
import {
  TextAnalyticsClient,
  AzureKeyCredential,
} from "@azure/ai-text-analytics";
import "./App.scss";

function App() {
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentiment, setSentiment] = useState("");
  const [confidenceScores, setConfidenceScores] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const theme = getTheme();

  const key = process.env.REACT_APP_ACS_KEY;
  const endpoint = "https://cplt-sentiment.cognitiveservices.azure.com/";

  const textAnalyticsClient = new TextAnalyticsClient(
    endpoint,
    new AzureKeyCredential(key)
  );

  const handleChange = (event) => {
    setTextValue(event.currentTarget.value);
  };

  const handleClick = async () => {
    if (textValue.length > 1) {
      setLoading(true);
      // Start sentiment analysis
      const sentimentInput = [textValue];
      const sentimentResult = await textAnalyticsClient.analyzeSentiment(
        sentimentInput
      );
      // End sentiment analysis
      setSentiment(sentimentResult[0].sentiment);
      setConfidenceScores(sentimentResult[0].confidenceScores);
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Text as="h1" variant={"xxLarge"} className="app-heading">
        Sentiment Analysis POC
      </Text>
      <TextField
        label="Text to be analyzed"
        value={textValue}
        onChange={handleChange}
      />
      <PrimaryButton text="Submit" onClick={handleClick} />
      {loading && <Spinner size={SpinnerSize.large} />}
      {sentiment && (
        <div
          className="sentiment-result"
          style={{ boxShadow: theme.effects.elevation8 }}
        >
          <Stack>
            <Text as="h2" variant={"mediumPlus"}>
              Sentiment:
            </Text>
            <Text as="p" variant={"medium"}>
              {sentiment}
            </Text>
            <Text as="h2" variant={"mediumPlus"}>
              Confidence:
            </Text>
            <Text as="p" variant={"medium"}>
              {confidenceScores.positive * 100}% positive,{" "}
              {confidenceScores.negative * 100}% negative,{" "}
              {confidenceScores.neutral * 100}% neutral.
            </Text>
          </Stack>
        </div>
      )}
    </div>
  );
}

export default App;
