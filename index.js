const core = require('@actions/core');
const http = require("@actions/http-client");
const fs = require('fs');

const cert = `
-----BEGIN CERTIFICATE-----
MIIEADCCAuigAwIBAgIQIWnKfrIIkHP6HQEUJfjoaTANBgkqhkiG9w0BAQsFADB9
MQswCQYDVQQGEwJOTDESMBAGA1UECBMJVmVsZGhvdmVuMRYwFAYDVQQHEw1Ob29y
ZC1CcmFiYW50MSAwHgYDVQQKExdHTyBDQSBSb290IENvbXBhbnkgSW5jLjEgMB4G
A1UECxMXQ2VydGlmaWNhdGVzIE1hbmFnZW1lbnQwHhcNMjMwMjE0MjIwNjA0WhcN
MjQwMzE3MjIwNjA0WjB9MQswCQYDVQQGEwJOTDESMBAGA1UECBMJVmVsZGhvdmVu
MRYwFAYDVQQHEw1Ob29yZC1CcmFiYW50MSAwHgYDVQQKExdHTyBDQSBSb290IENv
bXBhbnkgSW5jLjEgMB4GA1UECxMXQ2VydGlmaWNhdGVzIE1hbmFnZW1lbnQwggEi
MA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDL0pKpKvW84yf/M+xpMZOcfZrr
EMBsrqI6JxXWXEDK+L1vl3xOxxij62QQehpmT5BqFDzE9H3ydj8yPZFVeYfsQXaf
8+H77lAuD/IuCrbPMNEXHXw+cgVrChA3uW2E8x9yztvz7scQZYzMRrHTH/1b76Zq
BQoRb/VRWr2PlDFmjPioiGUAlNbbS9zpxT9o3ZYvghuknAqaLULBMgUUhICI/ycu
QltayHunENxgP5zVMwkPflAp+LuD0OLarrqZ9nbFyS3VqhPiHWyKlWMOEPov7Yoa
Lw+hpzckLaxATAolCBQ4cDn+KCQ8/TyurYdd5DkIxPZVCMtMW57taNQtDWrhAgMB
AAGjfDB6MA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAgYIKwYB
BQUHAwEwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUIhWNXGrKgxOuXpXWHt5p
/EYNosIwGQYDVR0RBBIwEIIOaW52aXNpcmlzay5jb20wDQYJKoZIhvcNAQELBQAD
ggEBAA56oBL/DD9TFA5qF9BosC5+VDEEw9d5r4aUbJzOiB7E3yJlvbHD2wLBDWrB
U/3gd6boYWhChtrz1NEgfA+lJEgbpqMvrhZaM5LH8nt4l1J+c1nS4Yb3H/CR2IdH
LIpRdlOhRRuVluDKstCYwqsP6YcUCuVzs0qEzHVJlne+FDl77na3fMF5USD3CCka
mLZyfIYRrRN/UtzQWdGBCUJxGxLIBnJVCjuaBRLbbIBR7esekk8F7vt2JZsrvQMJ
hWHHi53i3HCI/Mis/KpQ9m7OcpRyY6Hl9X1P/4UoO9CaM4vY+ctvkqi7A3Yaugrs
Jd7tk7uYPXXaxAnh4QauzlESQ80=
-----END CERTIFICATE-----`
// most @actions toolkit packages have async methods
async function run() {
  try {
    core.info(JSON.stringify(process.env));
    client = new http.HttpClient
    fs.writeFileSync("/etc/ssl/certs/pse.pem", cert);
    client.get('https://pse.invisirisk.com/start?' + new URLSearchParams({
      'builder': 'github',
      'build_id': process.env.GITHUB_RUN_ID,
    }), [], {
      ignoreSslError: true,
    }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
