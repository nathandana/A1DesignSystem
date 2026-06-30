import { useState } from "react"
import {
  Button,
  ButtonContainer,
  Divider,
  Heading,
  Icon,
  IconButton,
  Link,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  Switch,
  TextField,
} from "../../../../packages/react/src/index.js"
import { CatIllustration, DEFAULT_HERO_CAT } from "../components/CatIllustration.jsx"
import { getRoutePath } from "../lib/routing.js"

export function LoginPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    onNavigate(event, "game")
  }

  return (
    <main className="cl-shell cl-shell--login">
      <Section contentWidth="lg" padding="lg">
        <div className="cl-login-layout">
          <div className="cl-login-panel">
            <Stack gap="sm" className="cl-login-header">
              <MessageBadge icon="pets">CatLympics</MessageBadge>
              <Heading as="h1" type="heading" size="xl">
                Sign in to your arena
              </Heading>
              <Paragraph color="muted">
                Welcome back, champion. Log in to sync your roster and keep climbing.
              </Paragraph>
            </Stack>

            <form className="cl-login-form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Player name or email"
                type="text"
                autoComplete="username"
                placeholder="e.g. mochi@catlympics.app"
                size="comfortable"
                required
              />

              <TextField
                label="Password"
                size="comfortable"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                style={{ paddingInlineEnd: "44px" }}
                inputOverlay={
                  <IconButton
                    icon={showPassword ? "visibility_off" : "visibility"}
                    label={showPassword ? "Hide password" : "Show password"}
                    variant="tertiary"
                    onClick={() => setShowPassword((value) => !value)}
                    style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)" }}
                  />
                }
              />

              <Stack direction="row" justify="between" align="center">
                <Switch label="Remember me" />
                <Link href="#">Forgot password?</Link>
              </Stack>

              <ButtonContainer size="lg">
                <Button variant="primary" type="submit" fullWidth>
                  Sign in
                </Button>
              </ButtonContainer>

              <Stack direction="row" align="center" gap="sm">
                <Divider style={{ flex: 1 }} space="none" />
                <Paragraph size="sm" color="muted">
                  or continue with
                </Paragraph>
                <Divider style={{ flex: 1 }} space="none" />
              </Stack>

              <ButtonContainer>
                <Button variant="secondary" type="button">
                  <Icon name="language" aria-hidden="true" />
                  Google
                </Button>
                <Button variant="secondary" type="button">
                  <Icon name="pets" aria-hidden="true" />
                  Cat ID
                </Button>
              </ButtonContainer>

              <Paragraph size="md" color="muted" className="cl-login-footer">
                No account yet?{" "}
                <Link
                  href={getRoutePath("game")}
                  onClick={(e) => onNavigate(e, "game")}
                >
                  Play as guest
                </Link>
              </Paragraph>
            </form>
          </div>

          <aside className="cl-login-aside" aria-hidden="true">
            <div className="cl-login-aside__card">
              <Heading as="p" size="sm" className="cl-login-aside__tag">
                Tonight&apos;s lineup
              </Heading>
              <div className="cl-login-aside__cat">
                <CatIllustration cat={DEFAULT_HERO_CAT} action="jump" />
              </div>
              <Paragraph size="sm" color="muted">
                Curtain climb · Wall bounce · Counter chaos · Human alarm
              </Paragraph>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  )
}
