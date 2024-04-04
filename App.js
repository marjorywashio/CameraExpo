import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera/next';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  // Mostra a câmera se as permissões foram concedidas
  useEffect(() => {
    if (permission && permission.granted) {
      setShowCamera(true);
    }
  }, [permission]);

  // Troca entre a câmera traseira e frontal (a câmera inicial é a traseira)
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Desliga a câmera e volta à página inicial
  function returnToPage() {
    setShowCamera(false);
    setScannedData(null);
  }

  //recebe o resultado do escaneamento como argumento e atualiza o scannedData com os dados
  function handleBarCodeScanned(scanningResult){
    setScannedData(scanningResult.data);
  }

  // renderiza o botão quando o showCamera for falso
  if (!showCamera) {
    return (
      <View style={styles.container}>
        <Button title="Acessar câmera" onPress={() => requestPermission()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "upc_a"] }} //QRCode e Códigos de barras mais utilizados no BR
        onBarcodeScanned={handleBarCodeScanned}> {/* passa o código escaneado para a função handleBarCodeScanned*/}
        
        {/* Se existir dado escaneado, aparece no Text */}
        {scannedData && (
          <View style={styles.scannedDataContainer}>
            <Text style={styles.scannedDataText}>{scannedData}</Text>
          </View>
        )}

          <View style={styles.buttonContainer}>

            <TouchableOpacity style={styles.buttonCamera} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonReturn} onPress={returnToPage}>
              <Text style={styles.text}>Return</Text>
            </TouchableOpacity>

          </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  buttonCamera: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  buttonReturn: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  scannedDataContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  scannedDataText: {
    fontSize: 16,
    color: 'white',
  },
});
