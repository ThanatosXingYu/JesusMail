<div align="center">
  <a name="readme-top"></a>
  <h1>JesusMail 📧</h1>
  <p><strong>Posta kutusu dağıtımı ve işletimi için kendi sunucunuzda çalışan e-posta platformu</strong></p>
  <p>Sürüm 1.0.0</p>

[English](README.md) | [简体中文](README-zh_CN.md) | [日本語](README-ja.md) | Türkçe
</div>

## JesusMail nedir?

JesusMail; posta sunucusu, web posta, posta kutusu yönetimi, aktivasyon koduyla teslim ve e-posta kampanyası araçlarını tek bir kendi kendine barındırılan sistemde birleştirir. Pazar yerleri, özel satış kanalları veya bayiler üzerinden yönetilen posta kutuları sunan işletmecilerin oluşturma, etkinleştirme, sona erme, geri dönüşüm ve destek süreçlerini yönetmesine yardımcı olur.

## Başlıca özellikler

- Alan adı ve posta kutusu yönetimi
- Aktivasyon kodu oluşturma, gruplama, dışa aktarma, bağlantı temizleme ve kullanma
- Yapılandırılabilir sona erme tarihine sahip herkese açık aktivasyon sayfası
- İlgili web posta hesabına güvenli tek tıkla giriş
- Varsayılan 30 günlük saklama süresine sahip posta kutusu geri dönüşüm kutusu
- Kampanyalar, kişiler, şablonlar, teslimat analizi ve ısıtma araçları
- Entegre Roundcube web posta
- PostgreSQL, Redis, Postfix, Dovecot ve Rspamd için Docker Compose dağıtımı

## Dağıtım akışı

1. Yönetici JesusMail panelinde bir veya daha fazla aktivasyon kodu oluşturur.
2. Kod, seçilen satış kanalı üzerinden müşteriye teslim edilir.
3. Müşteri herkese açık aktivasyon sayfasında uygun bir posta kutusu adı ve geçerlilik süresi seçerek kodu kullanır.
4. Yönetici kod bağlantısını, posta kutusu kaynağını ve sona erme tarihini inceleyebilir.
5. Kullanıcı kimlik bilgileriyle giriş yapabilir; yönetici destek sırasında tek tıkla girişi kullanabilir.
6. Kod bağlantısı temizlendiğinde ilgili posta kutusu geri dönüşüm yaşam döngüsüyle kaldırılır ve kod kullanılmamış duruma döner.

## Gereksinimler

- Docker Engine ve Docker Compose v2 bulunan bir Linux sunucusu
- MX, SPF, DKIM ve DMARC kayıtları yönetilebilen genel bir alan adı
- Dağıtım için gerekli posta ve yönetim portları
- Üretim kurulumu veya güncellemesi öncesinde doğrulanmış tam yedek

## Mevcut kaynak dizininden kurulum

Bu özelleştirilmiş sürümün herkese açık depo adresi belgelerde sabitlenmemiştir. JesusMail kaynağını yetkili dağıtım kanalından aldıktan sonra şunları çalıştırın:

```shell
cd /path/to/JesusMail
cp env_init .env
# Servisleri başlatmadan önce .env içindeki tüm değerleri inceleyin.
docker compose up -d
```

Kurulum betiğinin yapılandırmasını ve uyumluluk davranışını inceledikten sonra şu yöntem de kullanılabilir:

```shell
cd /path/to/JesusMail
bash install.sh
```

> Doğrulanmış veritabanı, yapılandırma ve posta verisi yedeği olmadan üretim sistemini güncellemeyin.

## Yönetim komutları

```shell
bm help          # Kullanılabilir komutlar
bm default       # Yönetici erişim bilgileri
bm show-record   # DNS kayıt gereksinimleri
bm status        # Konteyner durumu
bm restart       # JesusMail servislerini yeniden başlat
```

Mevcut kurulumlarla güvenli uyumluluğu korumak için bazı servis adları, yollar, veritabanı adları ve ortam değişkenleri dahili uyumluluk tanımlayıcılarını korur. Bunlar uygulama ayrıntılarıdır ve ürün adını temsil etmez.

## Web posta

Roundcube genellikle `/roundcube/` altında kullanılabilir. JesusMail, yetkili yöneticinin posta kutusu parolasını tarayıcı URL'sine koymadan ilgili hesabı açabilmesi için kısa ömürlü ve tek kullanımlık bir giriş bileti oluşturabilir.

## Üretim güvenliği

Değişiklikten önce tutarlı PostgreSQL dökümünü, Maildir verisini, gerekli kalıcı servis verilerini, `.env` ve Compose dosyalarını, `conf/` dizinini, ters vekil/TLS ayarlarını, imaj kimliklerini ve konteyner inceleme bilgilerini yedekleyin. Kurtarma süreci doğrulanmadan birimleri veya Docker verisini silen komutları çalıştırmayın.

## Katkı ve destek

Sorun bildirirken veya değişiklik önerirken bu deponun Issue ve Pull Request şablonlarını kullanın. Parola, aktivasyon kodu, API anahtarı, özel anahtar, müşteri adresi veya üretim verisi paylaşmayın.

## Lisans

JesusMail, [GNU Affero General Public License v3.0](LICENSE) kapsamında dağıtılır. Üçüncü taraf bileşenlerin kendi lisansları ve bildirimleri geçerliliğini korur.
