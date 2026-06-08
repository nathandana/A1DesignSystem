import { Alert } from 'react-native';
import { IconButton, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { View } from 'react-native';
import { Row, ScreenShell, Section } from './ScreenShell';

export function IconButtonScreen() {
  return (
    <ScreenShell title="IconButton" subtitle="Square icon-only action buttons.">

      <Section title="Variants">
        <Row>
          <IconButton icon="add"      label="Add"     variant="tertiary"    onPress={() => Alert.alert('Tertiary')} />
          <IconButton icon="download" label="Save"    variant="secondary"   onPress={() => Alert.alert('Secondary')} />
          <IconButton icon="delete"   label="Delete"  variant="destructive" onPress={() => Alert.alert('Destructive')} />
          <IconButton icon="check"    label="Approve" variant="success"     onPress={() => Alert.alert('Success')} />
        </Row>
      </Section>

      <Section title="Sizes">
        <Row>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <IconButton icon="add" label="Add sm" size="sm" onPress={() => {}} />
            <Paragraph size="xs" color="muted">sm · 36pt</Paragraph>
          </View>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <IconButton icon="add" label="Add md" size="md" onPress={() => {}} />
            <Paragraph size="xs" color="muted">md · 44pt</Paragraph>
          </View>
        </Row>
      </Section>

      <Section title="Common actions">
        <Row wrap>
          <IconButton icon="close"           label="Close"     variant="tertiary"    onPress={() => {}} />
          <IconButton icon="edit"            label="Edit"      variant="tertiary"    onPress={() => {}} />
          <IconButton icon="more-vert"       label="More"      variant="tertiary"    onPress={() => {}} />
          <IconButton icon="search"          label="Search"    variant="tertiary"    onPress={() => {}} />
          <IconButton icon="share"           label="Share"     variant="secondary"   onPress={() => {}} />
          <IconButton icon="favorite-border" label="Favourite" variant="secondary"   onPress={() => {}} />
          <IconButton icon="delete"          label="Delete"    variant="destructive" onPress={() => {}} />
          <IconButton icon="check-circle"    label="Confirm"   variant="success"     onPress={() => {}} />
        </Row>
      </Section>

      <Section title="Disabled">
        <Row>
          <IconButton icon="add"    label="Add"    variant="tertiary"    disabled onPress={() => {}} />
          <IconButton icon="edit"   label="Edit"   variant="secondary"   disabled onPress={() => {}} />
          <IconButton icon="delete" label="Delete" variant="destructive" disabled onPress={() => {}} />
        </Row>
      </Section>

    </ScreenShell>
  );
}
