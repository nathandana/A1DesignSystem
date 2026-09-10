export const BUTTON_CONTAINER_QUERY_WIDTH = 480;

export function buttonContainerDirectionAtWidth(width) {
  const value = Number(width);
  return Number.isFinite(value) && value < BUTTON_CONTAINER_QUERY_WIDTH ? 'stacked' : 'inline';
}
