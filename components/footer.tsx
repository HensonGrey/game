// import { View, Text, Pressable } from "react-native";
// import { router, usePathname } from "expo-router";
// import { FontAwesome5 } from "@expo/vector-icons";

// const Footer = () => {
//   const pathname = usePathname();

//   const tabs = [
//     { label: "Store", icon: "store", route: "/store" },
//     { label: "Home", icon: "home", route: "/home" },
//   ];

//   return (
//     <View className="bg-slate-800 px-4 py-6 flex-row gap-3">
//       {tabs.map((tab) => {
//         const isActive = pathname === tab.route;
//         return (
//           <Pressable
//             key={tab.route}
//             onPress={() => router.push(tab.route)}
//             className={`flex-1 flex-row items-center justify-center gap-2 py-6 rounded-xl ${
//               isActive ? "bg-slate-600" : "bg-slate-700"
//             }`}
//           >
//             <FontAwesome5
//               name={tab.icon}
//               size={18}
//               color={isActive ? "#C084FC" : "#6B7280"}
//               solid={isActive}
//             />
//             <Text
//               className={`text-sm font-semibold ${
//                 isActive ? "text-purple-400" : "text-gray-500"
//               }`}
//             >
//               {tab.label}
//             </Text>
//           </Pressable>
//         );
//       })}
//     </View>
//   );
// };

// export default Footer;
