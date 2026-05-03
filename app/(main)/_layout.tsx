import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function MainLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <View className="flex-1 bg-gray-600">
          <Slot />
        </View>
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
