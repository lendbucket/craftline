/**
 * Shared client side validation predicates.
 *
 * Deliberately forgiving. These forms exist to start a conversation, and a
 * validator that rejects a real person's real details because of a format
 * opinion costs more than the bad data it prevents. Anything genuinely strict
 * belongs on the server, once there is a server.
 */

/** Non empty after trimming. */
export function required(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Email check, intentionally loose: something, an @, something, a dot, and a
 * couple of letters. Full RFC 5322 is unreadable, rejects addresses that work,
 * and still cannot tell you whether a mailbox exists. Delivery is the only real
 * test and that happens later.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());
}

/**
 * Ten digits or more, ignoring formatting entirely. Covers North American
 * numbers written any way a person writes them, plus country codes, without
 * pretending to know which country the number is from.
 */
export function isPhone(value: string): boolean {
  return (value.match(/\d/g) || []).length >= 10;
}
