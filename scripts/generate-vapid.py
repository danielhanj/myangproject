"""One-off script: generates a VAPID key pair for Web Push.
Run once, copy the printed values into Vercel env vars, then this file isn't needed again.
"""
import base64
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

public_numbers = public_key.public_numbers()
x = public_numbers.x.to_bytes(32, "big")
y = public_numbers.y.to_bytes(32, "big")
public_raw = b"\x04" + x + y  # uncompressed EC point, what browsers expect

private_value = private_key.private_numbers().private_value
private_raw = private_value.to_bytes(32, "big")

print("VAPID_PUBLIC_KEY=" + b64url(public_raw))
print("VAPID_PRIVATE_KEY=" + b64url(private_raw))
