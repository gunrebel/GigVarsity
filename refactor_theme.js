const fs = require('fs');
const path = require('path');

const files = [
  "app/(student)/_layout.tsx",
  "app/(student)/profile.tsx",
  "app/(student)/job-detail.tsx",
  "app/(student)/home.tsx",
  "app/(student)/chat.tsx",
  "app/(student)/browse.tsx",
  "app/(student)/apply.tsx",
  "app/(student)/applications.tsx",
  "app/(shared)/chat/[id].tsx",
  "app/(company)/_layout.tsx",
  "app/(company)/talent.tsx",
  "app/(company)/settings.tsx",
  "app/(company)/post-job.tsx",
  "app/(company)/dashboard.tsx",
  "app/(company)/chat.tsx",
  "app/(auth)/onboarding.tsx",
  "app/(auth)/login.tsx",
  "app/(auth)/forgot-password.tsx",
  "app/(auth)/choose-role.tsx"
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${file}`);
    continue;
  }
  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already refactored
  if (content.includes('useThemePalette')) {
    console.log(`Already refactored ${file}`);
    continue;
  }

  // 1. Replace import
  content = content.replace(
    /import\s+{\s*palette\s*}\s+from\s+['"]@\/constants\/colors['"];?/,
    "import { useThemePalette } from '@/constants/colors';"
  );

  // 2. Add hook and memoized styles inside component
  content = content.replace(
    /export\s+default\s+function\s+(\w+)\s*\((.*?)\)\s*{/,
    "export default function $1($2) {\n  const palette = useThemePalette();\n  const styles = React.useMemo(() => getStyles(palette), [palette]);"
  );

  // 3. Replace StyleSheet.create
  content = content.replace(
    /const\s+styles\s*=\s*StyleSheet\.create\({/,
    "const getStyles = (palette: any) => StyleSheet.create({"
  );

  // Ensure React is imported if we are using React.useMemo (although most files have it)
  if (!content.includes('import React')) {
      content = "import React from 'react';\n" + content;
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Refactored ${file}`);
}
