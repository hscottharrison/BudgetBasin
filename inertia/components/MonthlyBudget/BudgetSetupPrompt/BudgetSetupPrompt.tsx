import { Box, Button, Card, Flex, Heading, Text } from '@radix-ui/themes'
import { CalendarIcon, PlusIcon } from 'lucide-react'
import './style.css'

interface BudgetSetupPromptProps {
  hasCategories: boolean
  hasTemplate: boolean
  hasPeriod: boolean
  onCreatePeriod: () => void
  setShowCreateBudgetForm: (show: boolean) => void
}

export default function BudgetSetupPrompt({
  hasCategories,
  hasTemplate,
  hasPeriod,
  onCreatePeriod,
  setShowCreateBudgetForm,
}: BudgetSetupPromptProps) {
  // User hasn't set up anything yet
  if (!hasCategories || !hasTemplate) {
    return (
      <Card className="budget-setup-card">
        <Flex direction="column" align="center" gap="4" py="6">
          <Box className="setup-icon">
            <CalendarIcon size={48} strokeWidth={1.5} />
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Heading size="5" mb="2">Let's Set Up Your Budget!</Heading>
            <Text size="2" color="gray" style={{ maxWidth: 400, display: 'block' }}>
              Create income and expense categories, set your monthly targets, 
              and start tracking your spending.
            </Text>
          </Box>
          
          <Flex direction="column" gap="3" mt="2">
            <SetupStep 
              number={1} 
              title="Add Categories" 
              description="Create income sources and expense categories"
              completed={hasCategories}
            />
            <SetupStep 
              number={2} 
              title="Set Targets" 
              description="Define your expected income and budget limits"
              completed={hasTemplate}
            />
            <SetupStep 
              number={3} 
              title="Start Tracking" 
              description="Begin your first budget period"
              completed={hasPeriod}
            />
          </Flex>

          <Button size="3" mt="4" onClick={() => setShowCreateBudgetForm(true)}>
            <PlusIcon size={18} />
            Get Started
          </Button>
        </Flex>
      </Card>
    )
  }

  // User has categories and template, but no active period
  if (!hasPeriod) {
    const now = new Date()
    const monthName = now.toLocaleString('default', { month: 'long' })
    const year = now.getFullYear()

    return (
      <Card className="budget-setup-card">
        <Flex direction="column" align="center" gap="4" py="6">
          <Box className="setup-icon ready">
            <CalendarIcon size={48} strokeWidth={1.5} />
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Heading size="5" mb="2">Ready to Start {monthName}?</Heading>
            <Text size="2" color="gray" style={{ maxWidth: 400, display: 'block' }}>
              Your budget template is set up. Start a new period to begin tracking 
              your income and expenses for {monthName} {year}.
            </Text>
          </Box>

          <Button size="3" mt="4" onClick={onCreatePeriod}>
            <PlusIcon size={18} />
            Start {monthName} Budget
          </Button>
        </Flex>
      </Card>
    )
  }

  return null
}

interface SetupStepProps {
  number: number
  title: string
  description: string
  completed: boolean
}

function SetupStep({ number, title, description, completed }: SetupStepProps) {
  return (
    <Flex align="start" gap="3" className={`setup-step ${completed ? 'completed' : ''}`}>
      <Box className="step-number">
        {completed ? '✓' : number}
      </Box>
      <Box>
        <Text size="2" weight="medium">{title}</Text>
        <Text size="1" color="gray">{description}</Text>
      </Box>
    </Flex>
  )
}



