import { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Heading, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function DialogScreen() {
  const [basic, setBasic]       = useState(false);
  const [confirm, setConfirm]   = useState(false);
  const [form, setForm]         = useState(false);
  const [noTitle, setNoTitle]   = useState(false);

  return (
    <ScreenShell title="Dialog" subtitle="Modal overlay with title, body, and optional footer actions.">

      <Section title="Basic">
        <Button variant="primary" onPress={() => setBasic(true)}>Open dialog</Button>
        <Dialog open={basic} onClose={() => setBasic(false)} title="Dialog title">
          <Paragraph color="muted">
            This is the dialog body. It can contain any content — text, forms, or other components.
          </Paragraph>
        </Dialog>
      </Section>

      <Section title="Confirm action">
        <Button variant="destructive" onPress={() => setConfirm(true)}>Delete item</Button>
        <Dialog
          open={confirm}
          onClose={() => setConfirm(false)}
          title="Delete item?"
          footer={
            <>
              <Button variant="secondary" onPress={() => setConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onPress={() => setConfirm(false)}>Delete</Button>
            </>
          }
        >
          <Paragraph color="muted">
            This action cannot be undone. The item will be permanently removed.
          </Paragraph>
        </Dialog>
      </Section>

      <Section title="With rich footer">
        <Button variant="secondary" onPress={() => setForm(true)}>Open with actions</Button>
        <Dialog
          open={form}
          onClose={() => setForm(false)}
          title="Upgrade plan"
          footer={
            <>
              <Button variant="tertiary" onPress={() => setForm(false)}>Maybe later</Button>
              <Button variant="primary" onPress={() => setForm(false)}>Upgrade now</Button>
            </>
          }
        >
          <View style={{ gap: 12 }}>
            <Paragraph color="muted">
              Unlock unlimited exports, priority support, and advanced analytics with the Pro plan.
            </Paragraph>
            <View style={{ gap: 6 }}>
              {['Unlimited exports', 'Priority support', 'Advanced analytics', 'Custom themes'].map(f => (
                <Paragraph key={f} size="sm">✓  {f}</Paragraph>
              ))}
            </View>
          </View>
        </Dialog>
      </Section>

      <Section title="No title">
        <Button variant="tertiary" onPress={() => setNoTitle(true)}>Open titleless</Button>
        <Dialog open={noTitle} onClose={() => setNoTitle(false)}>
          <Paragraph color="muted">
            A dialog without a title — the close button still renders in the header area.
          </Paragraph>
        </Dialog>
      </Section>

    </ScreenShell>
  );
}
