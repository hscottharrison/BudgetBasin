import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Button,
  Card,
  Callout,
  Separator,
  Badge,
  Link as RLink,
} from "@radix-ui/themes";
import * as Accordion from "@radix-ui/react-accordion";
import {
  ArrowRightIcon,
  LockClosedIcon,
  PieChartIcon,
  LightningBoltIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";

// Replace with your brand name and links
const APP_NAME = "BudgetBasin";

export default function LandingPage() {
  return (
    <Box style={{maxHeight: '100%', height: '100%', overflow: 'auto' }}>
      {/* Hero */}
      <Box
        id="hero"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -50%, var(--accent-5), transparent), linear-gradient(180deg, var(--accent-3), var(--mint-2))",
          borderBottom: "1px solid var(--gray-a5)",
          height: '100%'
        }}
      >
        <Container size="3" height='100%' style={{ height: '100%'}}>
          <Flex direction="column" align="center" justify="center" py="9" gap="5" height='100%'>
            <Heading align="center" size="9" style={{ lineHeight: 1.05 }}>
              Give every dollar a job—without opening new accounts.
            </Heading>
            <Text align="center" size="5" color="gray" style={{ maxWidth: 820 }}>
              Connect or enter your accounts, create buckets, and allocate your cash to the goals that matter—house, travel, emergencies, anything.
            </Text>
            <Flex gap="3" wrap="wrap" align="center" justify="center">
              <a href='/register'>
                <Button size="3">
                  Start your first bucket <ArrowRightIcon />
                </Button>
              </a>
              <a href='/login'>
                <Button variant="soft" size="3">
                  Sign In
                </Button>
              </a>
            </Flex>
            {/*<Flex gap="4" wrap="wrap" align="center" justify="center">*/}
            {/*  <Text size="2" color="gray">*/}
            {/*    Private by design*/}
            {/*  </Text>*/}
            {/*  <Separator orientation="vertical" decorative />*/}
            {/*  <Text size="2" color="gray">*/}
            {/*    Read‑only connections when available*/}
            {/*  </Text>*/}
            {/*  <Separator orientation="vertical" decorative />*/}
            {/*  <Text size="2" color="gray">*/}
            {/*    Industry‑standard encryption*/}
            {/*  </Text>*/}
            {/*</Flex>*/}
          </Flex>
        </Container>
      </Box>

      {/* Social proof placeholders */}
      {/*<Box style={{ backgroundColor: "var(--gray-1)" }}>*/}
      {/*  <Container size="3">*/}
      {/*    <Flex align="center" justify="center" py="5" gap="6" wrap="wrap">*/}
      {/*      <Text size="2" color="gray">"We finally know what our savings is for."</Text>*/}
      {/*      <Separator orientation="vertical" decorative />*/}
      {/*      <Text size="2" color="gray">"Buckets made our goals feel real."</Text>*/}
      {/*      <Separator orientation="vertical" decorative />*/}
      {/*      <Text size="2" color="gray">"We hit our travel fund two months early."</Text>*/}
      {/*    </Flex>*/}
      {/*  </Container>*/}
      {/*</Box>*/}

      {/* How it works */}
      <Box id="how" style={{ backgroundColor: "var(--gray-2)" }}>
        <Container size="3">
          <Flex direction="column" gap="5" py="8">
            <Heading size="8">How it works</Heading>
            <Grid columns={{ initial: "1", sm: "3" }} gap="4">
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Badge color="teal" variant="soft">Step 1</Badge>
                  <Heading size="5">Add your savings</Heading>
                  <Text color="gray">
                    Add balances manually or connect your accounts (coming soon). See your total savings in one place.
                  </Text>
                </Flex>
              </Card>
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Badge color="teal" variant="soft">Step 2</Badge>
                  <Heading size="5">Create buckets</Heading>
                  <Text color="gray">
                    Name your goals—Emergency, Down Payment, Travel. Set target amounts and optional dates.
                  </Text>
                </Flex>
              </Card>
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Badge color="teal" variant="soft">Step 3</Badge>
                  <Heading size="5">Allocate with confidence</Heading>
                  <Text color="gray">
                    Watch progress update instantly as balances change.
                  </Text>
                </Flex>
              </Card>
            </Grid>
            <Flex>
              <a href='/register'>
                <Button highContrast>Start your first bucket</Button>
              </a>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Features */}
      <Box id="features" style={{ backgroundColor: "var(--color-panel)" }}>
        <Container size="3">
          <Flex direction="column" gap="5" py="8">
            <Heading size="8">Why {APP_NAME}</Heading>
            <Grid columns={{ initial: "1", md: "2" }} gap="4">
              <Card size="3">
                <Flex gap="3" direction="column">
                  <Flex gap="2" align="center"><PieChartIcon />
                    <Heading size="5">Buckets without bank juggling</Heading>
                  </Flex>
                  <Text color="gray">
                    Keep your money where it already lives. Organize savings visually—no new accounts or messy transfers.
                  </Text>
                </Flex>
              </Card>
              <Card size="3">
                <Flex gap="3" direction="column">
                  <Flex gap="2" align="center"><LightningBoltIcon />
                    <Heading size="5">Allocation you can trust</Heading>
                  </Flex>
                  <Text color="gray">
                    Distribute your money to meet your goals. See what’s fully funded, underfunded, or unallocated.
                  </Text>
                </Flex>
              </Card>
              {/*<Card size="3">*/}
              {/*  <Flex gap="3" direction="column">*/}
              {/*    <Flex gap="2" align="center"><RocketIcon />*/}
              {/*      <Heading size="5">Targets that drive progress</Heading>*/}
              {/*    </Flex>*/}
              {/*    <Text color="gray">*/}
              {/*      Set goal amounts and (optionally) dates. Get clear time‑to‑target and milestone nudges.*/}
              {/*    </Text>*/}
              {/*  </Flex>*/}
              {/*</Card>*/}
              <Card size="3">
                <Flex gap="3" direction="column">
                  <Flex gap="2" align="center"><CheckCircledIcon />
                    <Heading size="5">Built for real life</Heading>
                  </Flex>
                  <Text color="gray">
                    Priorities change. Reorder goals, adjust targets, or reallocate in seconds—everything updates instantly.
                  </Text>
                </Flex>
              </Card>
            </Grid>
            <Flex>
              <Button variant="soft">Try the demo</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Security */}
      <Box id="security" style={{ backgroundColor: "var(--gray-2)", borderTop: "1px solid var(--gray-a5)" }}>
        <Container size="3">
          <Flex direction="column" gap="4" py="8">
            <Heading size="8">Security & Privacy</Heading>
            <Callout.Root>
              <Callout.Icon>
                <LockClosedIcon />
              </Callout.Icon>
              <Callout.Text>
                <Text weight="bold">Private by design.</Text> We only ask for what’s needed to show your savings and progress. When available, connections are read‑only and your data is protected with industry‑standard encryption.
              </Callout.Text>
            </Callout.Root>
            <Text size="2" color="gray">
              Replace this placeholder with your exact providers, policies, and security statement.
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Pricing */}
      <Box id="pricing" style={{ backgroundColor: "var(--color-panel)" }}>
        <Container size="3">
          <Flex direction="column" gap="5" py="8">
            <Heading size="8">Pricing</Heading>
            <Grid columns={{ initial: "1", sm: "2" }} gap="4">
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Badge variant="soft" color="green">Beta</Badge>
                  <Heading size="6">Free during beta</Heading>
                  <Text color="gray">Unlimited buckets and core features while we refine the experience.</Text>
                  <a href='/register'>
                    <Button highContrast>Join the beta</Button>
                  </a>
                </Flex>
              </Card>
              {/*<Card size="3">*/}
              {/*  <Flex direction="column" gap="3">*/}
              {/*    <Badge variant="soft" color="teal">Early Supporter</Badge>*/}
              {/*    <Heading size="6">$1 / month</Heading>*/}
              {/*    <Text color="gray">Advanced insights, shared goals, priority support.</Text>*/}
              {/*    <Button variant="soft">Get notified</Button>*/}
              {/*  </Flex>*/}
              {/*</Card>*/}
            </Grid>
          </Flex>
        </Container>
      </Box>

      {/* FAQ */}
      <Box id="faq" style={{ backgroundColor: "var(--gray-1)", borderTop: "1px solid var(--gray-a5)" }}>
        <Container size="3">
          <Flex direction="column" gap="5" py="8">
            <Heading size="8">FAQ</Heading>
            <Accordion.Root type="single" collapsible>
              {faqItems.map((item, i) => (
                <Accordion.Item key={i} value={`item-${i}`}>
                  <Accordion.Header>
                    <Accordion.Trigger asChild>
                      <Box
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "var(--space-3) var(--space-4)",
                          backgroundColor: "var(--color-panel)",
                          borderRadius: "var(--radius-3)",
                          border: "1px solid var(--gray-a5)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        <Heading size="4">{item.q}</Heading>
                      </Box>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content asChild>
                    <Box px="4" pb="4">
                      <Text color="gray">{item.a}</Text>
                    </Box>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Flex>
        </Container>
      </Box>

      {/* CTA band */}
      <Box
        style={{
          background:
            "linear-gradient(90deg, var(--accent-4), var(--mint-4))",
          borderTop: "1px solid var(--gray-a5)",
        }}
      >
        <Container size="3">
          <Flex align="center" justify="between" py="7" wrap="wrap" gap="4">
            <Heading size="7">Ready to see your savings—sorted?</Heading>
            <Flex gap="3">
              <Button size="3" highContrast>
                Get started free <ArrowRightIcon />
              </Button>
              <Button size="3" variant="soft">
                Watch a 60‑second tour
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Footer */}
      <Box style={{ backgroundColor: "var(--gray-2)" }}>
        <Container size="3">
          <Flex direction={{ initial: "column", sm: "row" }} justify="between" py="6" gap="4">
            <Flex direction="column" gap="2">
              <Text weight="bold">{APP_NAME}</Text>
              <Text size="2" color="gray">Your savings, sorted.</Text>
            </Flex>
            {/*<Flex gap="5" wrap="wrap">*/}
            {/*  <RLink href="#">Security</RLink>*/}
            {/*  <RLink href="#">Privacy</RLink>*/}
            {/*  <RLink href="#">Terms</RLink>*/}
            {/*  <RLink href="#">Help</RLink>*/}
            {/*</Flex>*/}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

const faqItems = [
  {
    q: "Do I have to move money between banks?",
    a: "No. Buckets are a planning layer that sits on top of your existing accounts. Keep your money where it is; get clarity on what it’s for.",
  },
  {
    q: "Will this affect my credit or my bank?",
    a: "No. Viewing balances and allocating buckets doesn’t touch your credit and doesn’t change your bank accounts.",
  },
  // {
  //   q: "How do connections work?",
  //   a: "Where supported, we use secure, read‑only connections through trusted third‑party providers. You can also add balances manually.",
  // },
  // {
  //   q: "Can I share goals with a partner?",
  //   a: "Yes. Create shared buckets (optional) so you can plan and track together.",
  // },
  {
    q: "What if my priorities change?",
    a: "Reallocate in seconds. Your targets, timeline, and progress update instantly.",
  },
  {
    q: "Is my data safe?",
    a: "We use industry‑standard encryption and follow strict data‑handling practices. See our Security page for details.",
  },
];
