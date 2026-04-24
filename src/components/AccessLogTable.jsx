export default function AccessLogTable({ logs }) {
  return (
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">DateTime</th>
          <th scope="col">Firstname</th>
          <th scope="col">Lastname</th>
          <th scope="col">Card UID</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr>
            <th scope="row">{log.id}</th>
            <td>{log.scanned_at}</td>
            <td>{log.first_name}</td>
            <td>{log.last_name}</td>
            <td>{log.uid}</td>
            <td>{log.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
