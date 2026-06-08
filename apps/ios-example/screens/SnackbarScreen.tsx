import { useState } from 'react';
import { View } from 'react-native';
import { Button, Snackbar } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function SnackbarScreen() {
  const [basic, setBasic] = useState(false);
  const [action, setAction] = useState(false);

  return (
    <ScreenShell title="Snackbar" subtitle="Temporary confirmation or recovery messages after an action.">
      <Section title="Basic">
        <View style={{ gap: 12 }}>
          <Button variant="primary" onPress={() => setBasic(true)}>Show snackbar</Button>
          <Snackbar
            visible={basic}
            message="Settings saved"
            onDismiss={() => setBasic(false)}
            duration={3000}
          />
        </View>
      </Section>

      <Section title="With action">
        <View style={{ gap: 12 }}>
          <Button variant="secondary" onPress={() => setAction(true)}>Archive item</Button>
          <Snackbar
            visible={action}
            message="Item archived"
            actionLabel="Undo"
            onAction={() => setAction(false)}
            onDismiss={() => setAction(false)}
            duration={5000}
          />
        </View>
      </Section>
    </ScreenShell>
  );
}
