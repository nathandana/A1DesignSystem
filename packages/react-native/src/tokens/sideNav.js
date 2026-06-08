import { spacingTokens } from './spacing';

export const sideNavTokens = {
    width: spacingTokens.component.sideNav.width,
    borderWidth: spacingTokens.component.sideNav.borderWidth,
    headerMinHeight: spacingTokens.component.sideNav.headerMinHeight,
    paddingBlock: spacingTokens.component.sideNav.paddingBlock,
    paddingInline: spacingTokens.component.sideNav.paddingInline,
    shadow: {
        shadowOffset: spacingTokens.component.sideNav.shadowOffset,
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 16,
    },
    item: {
        height: spacingTokens.component.sideNav.item.height,
        paddingInline: spacingTokens.component.sideNav.item.paddingInline,
        gap: spacingTokens.component.sideNav.item.gap,
        borderRadius: spacingTokens.component.sideNav.item.borderRadius,
        iconSize: spacingTokens.component.sideNav.item.iconSize,
        indent: spacingTokens.component.sideNav.item.indent,
        activeFontWeight: '500',
        chevronSize: spacingTokens.component.sideNav.item.chevronSize,
    },
};
