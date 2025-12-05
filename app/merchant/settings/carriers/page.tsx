"use client";

import { useState } from "react";

import {

  Page,

  Layout,

  Card,

  TextField,

  Button,

  Form,

  FormLayout,

  InlineError,

  Banner,

} from "@shopify/polaris";

export default function CarrierSettingsPage() {

  const [upsApiKey, setUpsApiKey] = useState("");

  const [upsUsername, setUpsUsername] = useState("");

  const [upsPassword, setUpsPassword] = useState("");

  const [upsAccountNumber, setUpsAccountNumber] = useState("");

  const [fedexApiKey, setFedexApiKey] = useState("");

  const [fedexSecretKey, setFedexSecretKey] = useState("");

  const [fedexAccountNumber, setFedexAccountNumber] = useState("");

  const [fedexMeterNumber, setFedexMeterNumber] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [saved, setSaved] = useState(false);

  const handleSubmit = async () => {

    setSaving(true);

    setError(null);

    setSaved(false);

    try {

      const res = await fetch("/api/merchant/update-carrier-keys", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          upsApiKey,

          upsUsername,

          upsPassword,

          upsAccountNumber,

          fedexApiKey,

          fedexSecretKey,

          fedexAccountNumber,

          fedexMeterNumber,

        }),

      });

      if (!res.ok) {

        const data = await res.json().catch(() => null);

        throw new Error(data?.error || "Failed to save settings");

      }

      setSaved(true);

    } catch (err: any) {

      console.error(err);

      setError(err.message || "Something went wrong");

    } finally {

      setSaving(false);

    }

  };

  return (

    <Page title="Carrier Integrations">

      <Layout>

        <Layout.Section>

          {saved && (

            <Banner tone="success" title="Settings saved">

              <p>Your carrier API settings have been updated.</p>

            </Banner>

          )}

          {error && (

            <InlineError message={error} fieldID="carrier-settings-error" />

          )}

        </Layout.Section>

        <Layout.Section>

          <Card>

            <div style={{ padding: '16px' }}>

              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>UPS</h2>

              <Form onSubmit={handleSubmit}>

                <FormLayout>

                <TextField

                  label="API Key"

                  value={upsApiKey}

                  onChange={setUpsApiKey}

                  autoComplete="off"

                />

                <TextField

                  label="Username"

                  value={upsUsername}

                  onChange={setUpsUsername}

                  autoComplete="off"

                />

                <TextField

                  label="Password"

                  value={upsPassword}

                  onChange={setUpsPassword}

                  type="password"

                  autoComplete="off"

                />

                <TextField

                  label="Account Number"

                  value={upsAccountNumber}

                  onChange={setUpsAccountNumber}

                  autoComplete="off"

                />

              </FormLayout>

            </Form>

            </div>

          </Card>

        </Layout.Section>

        <Layout.Section>

          <Card>

            <div style={{ padding: '16px' }}>

              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>FedEx</h2>

              <Form onSubmit={handleSubmit}>

                <FormLayout>

                <TextField

                  label="API Key"

                  value={fedexApiKey}

                  onChange={setFedexApiKey}

                  autoComplete="off"

                />

                <TextField

                  label="Secret Key"

                  value={fedexSecretKey}

                  onChange={setFedexSecretKey}

                  type="password"

                  autoComplete="off"

                />

                <TextField

                  label="Account Number"

                  value={fedexAccountNumber}

                  onChange={setFedexAccountNumber}

                  autoComplete="off"

                />

                <TextField

                  label="Meter Number"

                  value={fedexMeterNumber}

                  onChange={setFedexMeterNumber}

                  autoComplete="off"

                />

                <Button variant="primary" onClick={handleSubmit} loading={saving}>

                  Save Settings

                </Button>

              </FormLayout>

            </Form>

            </div>

          </Card>

        </Layout.Section>

      </Layout>

    </Page>

  );

}

