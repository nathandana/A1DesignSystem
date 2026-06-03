import { spacingTokens } from './spacing';

export const cardTokens = {
    padding: spacingTokens.component.card.padding,
    borderRadius: spacingTokens.component.card.borderRadius,
    borderWidth: spacingTokens.component.card.borderWidth,
    shadow: {
        shadowOffset: spacingTokens.component.card.shadowOffset,
        shadowOpacity: 0.10,
        shadowRadius: 3,
        elevation: 2,
    },
    // Small icon badge (top of card)
    icon: {
        containerSize: spacingTokens.component.card.icon.containerSize,
        containerBorderRadius: spacingTokens.component.card.icon.containerBorderRadius,
        marginBottom: spacingTokens.component.card.icon.marginBottom,
    },
    // Hero (full-bleed colored header)
    hero: {
        paddingVertical: spacingTokens.component.card.hero.paddingVertical,
        iconSize: spacingTokens.component.card.hero.iconSize,
    },
};
