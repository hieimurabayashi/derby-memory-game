import React from 'react';
import { 
  ScrollView, // ★ 画面をスクロールさせるために View から ScrollView に変更
  Text, 
  StyleSheet, 
  SafeAreaView, 
  View 
} from 'react-native';

// ダービーの由来データ (変更なし)
const derbyInfos = [
  { title: "1. ノースロンドン・ダービー (アーセナル vs トッテナム)", 
    desc: "[地理と歴史の因縁] 元々アーセナルは南ロンドンにいましたが、1913年にトッテナムのすぐ近所である北ロンドンのハイベリーへ移転しました。さらに1919年、リーグが再編される際、2部5位だったアーセナルが（不正があったとも噂される）政治力で1部へ昇格し、代わりに1部だったトッテナムが2部へ降格させられた、という歴史的な因縁が対立の始まりです。" },
  { title: "2. マンチェスター・ダービー (マン C vs マン U)",
    desc: "[同じ街のライバル] 最も分かりやすいダービーの一つで、同じマンチェスターという工業都市を本拠地とする2クラブの対決です。歴史的にはユナイテッドが圧倒的でしたが、2000年代以降のシティの台頭により、イングランドの覇権を争う最も激しいダービーの一つになりました。" },
  { title: "3. マージーサイド・ダービー (リヴァプール vs エヴァートン)",
    desc: "[地名（州）が由来] リヴァプール市は「マージーサイド州」という行政区画に属しており、その州都リヴァプールを本拠地とする両クラブの対決であることから名付けられました。元々は同じスタジアム（アンフィールド）を使っていましたが、スタジアムの賃料問題でエヴァートンが出ていき、残った側にリヴァプールFCが創設された歴史があります。" },
  { title: "4. タイン・ウェア・ダービー (ニューカッスル vs サンダーランド)",
    desc: "[川の名前に由来] ニューカッスルの中心を流れる「タイン川」と、サンダーランドを流れる「ウェア川」が名前の由来です。イングランド北東部の非常に近い位置にある2つの都市であり、歴史的（清教徒革命や産業革命）にも常に対立してきたライバル関係がサッカーにも反映されています。" },
  { title: "5. ウェストロンドン・ダービー (チェルシー vs フラム)",
    desc: "[地理的な近さ] チェルシーの本拠地（スタンフォード・ブリッジ）と、フラムの本拠地（クレイヴン・コテージ）は、ロンドン西部の同じ区（ハマースミス・アンド・フラム）にあり、直線距離でわずか2kmほどしか離れていません。この極端な近さがダービーの由来です。" },
  { title: "6. ブラックカントリー・ダービー (WBA vs ウルブス)",
    desc: "[地域の愛称が由来] 両チームが本拠地を置くウェスト・ミッドランズ州の一帯は、産業革命期に炭鉱、鉄鋼業、工場の煙（煤）で空や土地が黒くなったことから「Black Country（黒い地方）」と呼ばれていました。この工業地帯のライバル関係が由来です。" },
  { title: "7. M23 ダービー (ブライトン vs C・パレス)",
    desc: "[高速道路が由来] ダービーとしては珍しく、両チーム（ブライトンと南ロンドン）の地理は少し離れています。ライバル関係は1970年代に両チームが3部リーグで激しく昇格を争ったことに始まります。この2つの地域を結ぶ主要な高速道路が「M23」であることから、メディアによって名付けられました。（ただし、両チームのファンは「ダービー」ではなく、単なる「ライバル関係」と呼ぶことも多いです）。" },
  { title: "8. スティール・シティ・ダービー (シェフィールド U vs シェフィールド W)",
    desc: "[街の産業が由来] 両チームが本拠地を置くシェフィールド市は、産業革命期に鉄鋼業（Steel）で世界的に有名になりました。この「鉄鋼の街（Steel City）」で行われるダービーであることから名付けられました。" },
];

export const DerbyInfoScreen = () => {
  return (
    // ★ 修正点 1: SafeAreaView を View に変更
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true} // ★ 修正点 2: スクロールバーを明示的に表示
      >
        {derbyInfos.map((info, index) => (
          <View key={index} style={styles.infoBlock}>
            <Text style={styles.title}>{info.title}</Text>
            <Text style={styles.description}>{info.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#EFEFEF',
  },
  
  scrollView: {
    flex: 1, 
  },


  scrollContent: {
    padding: 15, 
  },
  infoBlock: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#003366',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});