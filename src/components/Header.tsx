interface HeaderProps {
  onInfoClick: () => void;
  onStatsClick: () => void;
}

export function Header({ onInfoClick, onStatsClick }: HeaderProps) {
  return (
    <div class="header">
      <div>
        <svg
          id="info-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 16 16"
          onClick={onInfoClick}
        >
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
        </svg>
      </div>
      <div>
        <span id="headline">Touchdown</span>
      </div>
      <div>
        <svg
          id="stats-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="32"
          viewBox="4 4 24 24"
          width="32"
          fill="currentColor"
          onClick={onStatsClick}
        >
          <path d="M20.6666 14.8333V5.5H11.3333V12.5H4.33325V26.5H27.6666V14.8333H20.6666ZM13.6666 7.83333H18.3333V24.1667H13.6666V7.83333ZM6.66659 14.8333H11.3333V24.1667H6.66659V14.8333ZM25.3333 24.1667H20.6666V17.1667H25.3333V24.1667Z" />
        </svg>
      </div>
    </div>
  );
}
