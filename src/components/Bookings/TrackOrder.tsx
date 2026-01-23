import { Clock, User, Truck, CheckCircle } from "lucide-react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect } from "react";

export type OrderStatus =
  | "Pending"
  | "Confirm Order"
  | "Dispatched to Courier"
  | "Delivered";

interface TrackOrderProps {
  orderId: string;
  status: OrderStatus;
  partnerName?: string;
  partnerPhone?: string;
  onClose: () => void;

  pending?: string;
  confirm?: string;
  dispatch?: string;
  delivered?: string;
}

const STEPS: OrderStatus[] = [
  "Pending",
  "Confirm Order",
  "Dispatched to Courier",
  "Delivered",
];

const statusIcon: Record<OrderStatus, any> = {
  Pending: Clock,
  "Confirm Order": CheckCircle,
  "Dispatched to Courier": Truck,
  Delivered: CheckCircle,
};

export default function TrackOrder({
  orderId,
  status,
  partnerName,
  partnerPhone,
  onClose,
  pending,
  confirm,
  dispatch,
  delivered,
}: TrackOrderProps) {
  const currentIndex = STEPS.indexOf(status);

  const stepDates: Record<OrderStatus, string | undefined> = {
    Pending: pending,
    "Confirm Order": confirm,
    "Dispatched to Courier": dispatch,
    Delivered: delivered,
  };

  const statusLabel: Record<OrderStatus, string> = {
  Pending: "Pending",
  "Confirm Order": "Confirm Order",
  "Dispatched to Courier": "Dispatched",
  Delivered: "Delivered",
};


  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      {/* Modal */}
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.orderId}>Order ID: {orderId}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {/* Line */}
          <View style={styles.line}>
            <View
              style={[
                styles.activeLine,
                {
                  width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
                },
              ]}
            />
          </View>

          {/* Steps */}
          <View style={styles.stepsRow}>
            {STEPS.map((step, index) => {
              const Icon = statusIcon[step];
              const active = index <= currentIndex;
              const date = stepDates[step];

              return (
                <View key={step} style={styles.step}>
                  <View
                    style={[
                      styles.iconCircle,
                      active ? styles.iconActive : styles.iconInactive,
                    ]}
                  >
                    <Icon size={16} color={active ? "#fff" : "#6b7280"} />
                  </View>

                  <Text style={styles.stepLabel}>{statusLabel[step]}</Text>
                  <Text style={styles.stepDate}>
                    {date ? formatDate(date) : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Partner Info */}
        <View>
          <Text style={styles.partnerTitle}>Assigned Partner</Text>
          {partnerName ? (
            <View style={styles.partnerRow}>
              <User size={16} color="#4b5563" />
              <Text style={styles.partnerText}>
                {partnerName} {partnerPhone}
              </Text>
            </View>
          ) : (
            <Text style={styles.partnerPending}>
              Will be assigned after confirmation
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    maxWidth: 420,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0050A5",
  },
  closeText: {
    color: "#ef4444",
    fontSize: 14,
  },
  timelineContainer: {
    marginBottom: 24,
    paddingHorizontal: -8,
  },
  line: {
    position: "absolute",
    top: 16,
    left: 32,
    right: 32,
    height: 2,
    backgroundColor: "#d1d5db",
  },
  activeLine: {
    height: "100%",
    backgroundColor: "#0050A5",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    alignItems: "center",
    width: 80,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  iconActive: {
    backgroundColor: "#0050A5",
  },
  iconInactive: {
    backgroundColor: "#e5e7eb",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    minHeight: 32,
  },
  stepDate: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 0,
    minHeight: 14,
  },
  partnerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  partnerText: {
    fontSize: 14,
    color: "#4b5563",
  },
  partnerPending: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
