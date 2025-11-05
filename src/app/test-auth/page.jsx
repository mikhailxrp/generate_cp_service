export default function TestAuthPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🔒 Защищенная страница</h1>
      <p>
        Если ты видишь эту страницу без авторизации - middleware НЕ работает
      </p>
      <p>Если тебя перенаправило на /login - middleware работает ✅</p>
    </div>
  );
}
