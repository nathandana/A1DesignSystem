import { useState } from 'react';
import { View } from 'react-native';
import { Heading, Pagination, Paragraph } from '@gtivr4/a1-design-system-react-native';
import { ScreenShell, Section } from './ScreenShell';

export function PaginationScreen() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(3);
  const [page3, setPage3] = useState(5);
  const [page4, setPage4] = useState(1);

  return (
    <ScreenShell title="Pagination" subtitle="Navigate between pages of content.">

      <Section title="Basic — 5 pages">
        <View style={{ gap: 8 }}>
          <Pagination page={page1} totalPages={5} onChange={setPage1} />
          <Paragraph size="sm" color="muted">Page {page1} of 5</Paragraph>
        </View>
      </Section>

      <Section title="Many pages — siblings=1">
        <View style={{ gap: 8 }}>
          <Pagination page={page2} totalPages={20} onChange={setPage2} siblings={1} />
          <Paragraph size="sm" color="muted">Page {page2} of 20</Paragraph>
        </View>
      </Section>

      <Section title="Many pages — siblings=2">
        <View style={{ gap: 8 }}>
          <Pagination page={page3} totalPages={20} onChange={setPage3} siblings={2} />
          <Paragraph size="sm" color="muted">Page {page3} of 20</Paragraph>
        </View>
      </Section>

      <Section title="Small size">
        <View style={{ gap: 8 }}>
          <Pagination page={page4} totalPages={8} onChange={setPage4} size="sm" />
          <Paragraph size="sm" color="muted">Page {page4} of 8</Paragraph>
        </View>
      </Section>

      <Section title="Edge cases">
        <View style={{ gap: 12 }}>
          <View style={{ gap: 4 }}>
            <Heading size="xs" color="muted">First page</Heading>
            <Pagination page={1} totalPages={10} onChange={() => {}} />
          </View>
          <View style={{ gap: 4 }}>
            <Heading size="xs" color="muted">Last page</Heading>
            <Pagination page={10} totalPages={10} onChange={() => {}} />
          </View>
          <View style={{ gap: 4 }}>
            <Heading size="xs" color="muted">Single page</Heading>
            <Pagination page={1} totalPages={1} onChange={() => {}} />
          </View>
        </View>
      </Section>

    </ScreenShell>
  );
}
