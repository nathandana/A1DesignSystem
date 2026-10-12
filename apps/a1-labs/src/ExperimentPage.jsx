import { TabsExperiment } from './tabs/TabsExperiment.jsx'
import { PaginationTypesExperiment } from './pagination-types/PaginationTypesExperiment.jsx'
import { DataTablesExperiment } from './data-tables/DataTablesExperiment.jsx'
import { AutomationBuilderExperiment } from './automation-builder/AutomationBuilderExperiment.jsx'
import { TokenStylingExperiment } from './token-styling/TokenStylingExperiment.jsx'
import { ChatExperiment } from './chat/ChatExperiment.jsx'
import { StepTrackerExperiment } from './step-tracker/StepTrackerExperiment.jsx'
import { StepsExperiment } from './steps/StepsExperiment.jsx'
import { ButtonMotionExperiment } from './button-motion/ButtonMotionExperiment.jsx'
import { LongFormExperiment } from './long-form/LongFormExperiment.jsx'
import { DateOfBirthExperiment } from './date-of-birth/DateOfBirthExperiment.jsx'
import { VerificationJourneyExperiment } from './verification-journey/VerificationJourneyExperiment.jsx'
import { BillboardActionsExperiment } from './billboard-actions/BillboardActionsExperiment.jsx'
import { ReorderingExperiment } from './reordering/ReorderingExperiment.jsx'
import { VerifyButtonExperiment } from './verify-button/VerifyButtonExperiment.jsx'
import React, { Suspense, lazy } from 'react'
import { PageConstructionExperiment } from './page-construction/PageConstructionExperiment.jsx'
import { RequiredFieldsExperiment } from './required-fields/RequiredFieldsExperiment.jsx'
import { TimelineExperiment } from './timeline/TimelineExperiment.jsx'
import { SlidesExperiment } from './slides/SlidesExperiment.jsx'
import { ModeSwitchesExperiment } from './mode-switches/ModeSwitchesExperiment.jsx'
import { RadioButtonsExperiment } from './radio-buttons/RadioButtonsExperiment.jsx'
import { AvatarsExperiment } from './avatars/AvatarsExperiment.jsx'
import { CodeHighlightingExperiment } from './code-highlighting/CodeHighlightingExperiment.jsx'
import { CheckboxMotionExperiment } from './checkbox-motion/CheckboxMotionExperiment.jsx'
import { PasswordStrengthExperiment } from './password-strength/PasswordStrengthExperiment.jsx'
import { ContextualHelpExperiment } from './contextual-help/ContextualHelpExperiment.jsx'
import { DialogMotionExperiment } from './dialog-motion/DialogMotionExperiment.jsx'
import { CelebrationsExperiment } from './celebrations/CelebrationsExperiment.jsx'
import { FitTextExperiment } from './fit-text/FitTextExperiment.jsx'
import { FenexExperiment } from './fenex/FenexExperiment.jsx'
import { BulkActionsExperiment } from './bulk-actions/BulkActionsExperiment.jsx'
import { MobileTablesExperiment } from './mobile-tables/MobileTablesExperiment.jsx'
import { AccordionMotionExperiment } from './accordion-motion/AccordionMotionExperiment.jsx'
import { SegmentedMotionExperiment } from './segmented-motion/SegmentedMotionExperiment.jsx'
import { BlueprintExperiment } from './page-blueprint/BlueprintExperiment.jsx'
import { PuzzleExperiment } from './page-puzzle/PuzzleExperiment.jsx'
import { PaintExperiment } from './page-paint/PaintExperiment.jsx'
import { SunriseExperiment } from './page-sunrise/SunriseExperiment.jsx'
import { ConnectedNodesExperiment } from './connected-nodes/ConnectedNodesExperiment.jsx'
import { ThinkingTerminalExperiment } from './thinking-terminal/ThinkingTerminalExperiment.jsx'
import { FrostedGlassExperiment } from './frosted-glass/FrostedGlassExperiment.jsx'
import { SwitchMorphExperiment } from './switch-morph/SwitchMorphExperiment.jsx'
import { FocusAnimationsExperiment } from './focus-animations/FocusAnimationsExperiment.jsx'
import { ButtonCompletionExperiment } from './button-completion/ButtonCompletionExperiment.jsx'
import { ImageGenerationExperiment } from './image-generation/ImageGenerationExperiment.jsx'
import { PageLoadingExperiment } from './page-loading/PageLoadingExperiment.jsx'

// Loaded on demand: it brings three.js and React Three Fiber, which should
// not weigh down the canvas or other experiments.
const TokenVisualizerExperiment = lazy(() => import('./token-visualizer/TokenVisualizerExperiment.jsx')
  .then(module => ({ default: module.TokenVisualizerExperiment })))

const FlipClockExperiment = lazy(() => import('./flip-clock/FlipClockExperiment.jsx')
  .then(module => ({ default: module.FlipClockExperiment })))

const FlipBillboardExperiment = lazy(() => import('./flip-billboard/FlipBillboardExperiment.jsx')
  .then(module => ({ default: module.FlipBillboardExperiment })))

const SwitchThreeExperiment = lazy(() => import('./switch-three/SwitchThreeExperiment.jsx')
  .then(module => ({ default: module.SwitchThreeExperiment })))

// Loaded on demand: it brings react-data-grid.
const DataGridExperiment = lazy(() => import('./data-grid/DataGridExperiment.jsx')
  .then(module => ({ default: module.DataGridExperiment })))

const TokenHierarchyExperiment = lazy(() => import('./token-hierarchy/TokenHierarchyExperiment.jsx').then(module => ({ default: module.TokenHierarchyExperiment })))

const experimentPages = {
  tabs: TabsExperiment,
  'pagination-types': PaginationTypesExperiment,
  'data-tables': DataTablesExperiment,
  'token-hierarchy': TokenHierarchyExperiment,
  'automation-builder': AutomationBuilderExperiment,
  'token-styling': TokenStylingExperiment,
  chat: ChatExperiment,
  'step-tracker': StepTrackerExperiment,
  steps: StepsExperiment,
  'button-motion': ButtonMotionExperiment,
  'switch-three': SwitchThreeExperiment,
  'flip-billboard': FlipBillboardExperiment,
  'flip-clock': FlipClockExperiment,
  'long-form': LongFormExperiment,
  'date-of-birth': DateOfBirthExperiment,

  'verification-journey': VerificationJourneyExperiment,
  'required-fields': RequiredFieldsExperiment,
  timeline: TimelineExperiment,
  slides: SlidesExperiment,
  'mode-switches': ModeSwitchesExperiment,
  'radio-buttons': RadioButtonsExperiment,
  avatars: AvatarsExperiment,
  'code-highlighting': CodeHighlightingExperiment,
  'checkbox-motion': CheckboxMotionExperiment,
  'password-strength': PasswordStrengthExperiment,
  'contextual-help': ContextualHelpExperiment,
  'dialog-motion': DialogMotionExperiment,
  celebrations: CelebrationsExperiment,
  'fit-text': FitTextExperiment,
  fenex: FenexExperiment,
  'bulk-actions': BulkActionsExperiment,
  'mobile-tables': MobileTablesExperiment,
  'data-grid': DataGridExperiment,
  'accordion-motion': AccordionMotionExperiment,
  'segmented-motion': SegmentedMotionExperiment,
  'billboard-actions': BillboardActionsExperiment,
  'page-blueprint': BlueprintExperiment,
  'page-puzzle': PuzzleExperiment,
  'page-paint': PaintExperiment,
  'page-sunrise': SunriseExperiment,
  reordering: ReorderingExperiment,
  'verify-button': VerifyButtonExperiment,
  'page-construction': PageConstructionExperiment,
  'connected-nodes': ConnectedNodesExperiment,
  'token-visualizer': TokenVisualizerExperiment,
  'thinking-terminal': ThinkingTerminalExperiment,
  'frosted-glass': FrostedGlassExperiment,
  'switch-morph': SwitchMorphExperiment,
  'focus-animations': FocusAnimationsExperiment,
  'ai-image-generation': ImageGenerationExperiment,
  'page-loading': PageLoadingExperiment,
  'button-completion': ButtonCompletionExperiment,
}

export function ExperimentPage(props) {
  const Page = experimentPages[props.experiment.id]
  return (
    <Suspense fallback={null}>
      <Page key={props.experiment.id} {...props} />
    </Suspense>
  )
}
