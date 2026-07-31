export function needsProfileSetup(user) {
  if (!user) return false;
  if (user.profile_complete === false) return true;
  if (user.profile_complete === true) return false;

  const roll = user.roll_number || '';
  return !roll.trim() || user.branch === 'TBD' || roll.startsWith('G-');
}
