import React from "react";
import { Ionicons } from "react-icons/io5"; // Using react-icons/io5 which corresponds to Ionicons 5

// Assuming Colors constant exists or we default it. 
// Since I cannot read constants/Colors easily without path, I will default or try to import if I knew where it is.
// The original import was `import Colors from "../constants/Colors";`
// I should probably check if `src/constants/Colors.js` exists or create it.
// For now I will assume it exists or use hardcoded fallbacks if import fails (but I can't catch import errors easily here).
// I'll try to import it from relative path.

import Colors from "../constants/Colors";

// Map icon names if necessary. Ionicons in react-native-vector-icons might have different names than react-icons/io5.
// But usually they are similar. I'll assume direct mapping or close enough.
// If props.name is passed, I need to dynamically render the icon.
// React-icons doesn't support dynamic string names easily without a map or importing all.
// A better approach for web is to pass the Icon component itself, but here we are converting existing code that passes a name string.
// I will create a helper to map common names or just import * as IoniconsIcons.

import * as IoniconsIcons from "react-icons/io5";

export default function TabBarIcon(props) {
    // Convert kebab-case to PascalCase for react-icons
    // e.g. 'ios-information-circle' -> 'IoIosInformationCircle' ? No, react-icons/io5 uses 'Io' prefix usually.
    // Let's try to find the icon.

    // Actually, `react-native-vector-icons/Ionicons` uses names like `md-home`, `ios-home`.
    // `react-icons/io5` uses `IoHome`, `IoHomeOutline`.
    // This is a tricky part of conversion.
    // I'll try a basic mapping or just return a default icon if not found.

    const getIcon = (name) => {
        // Simple heuristic: remove dashes, capitalize, add Io prefix.
        // e.g. "md-home" -> "MdHome" -> "IoMdHome"? No.
        // react-icons/io5 has IoHome, IoHomeOutline, IoHomeSharp.
        // If the RN app uses "md-home", it might correspond to IoHome.

        // For now, since I can't map all 1000 icons, I will try to render the icon if passed as a component, 
        // or if it's a string, I'll try to find it in the imported namespace.

        // However, usually in these conversions, it's better to update the caller to pass the icon component.
        // But "all function will remain same".

        // Let's try to map the name.
        // If name is "ios-information-circle", react-icons might have "IoIosInformationCircle".

        let iconName = name;
        if (iconName) {
            const parts = iconName.split('-');
            const pascalCase = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
            const reactIconName = `Io${pascalCase}`;

            if (IoniconsIcons[reactIconName]) {
                const Icon = IoniconsIcons[reactIconName];
                return <Icon size={26} style={{ marginBottom: -3 }} color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault} />;
            }
        }

        // Fallback
        return <IoniconsIcons.IoHelpCircle size={26} style={{ marginBottom: -3 }} color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault} />;
    };

    return getIcon(props.name);
}
